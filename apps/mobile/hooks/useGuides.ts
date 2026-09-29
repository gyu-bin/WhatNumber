import { useCallback, useEffect, useRef, useState } from 'react';
import { loadGuideFlags, markGuideDone, type GuideFlags } from '../services/guides/guideStorage';

export type ActiveGuide = 'firstLaunch' | 'manual' | 'widgetIntro' | 'widgetHowTo' | 'emergency' | null;

export function useGuides(widgetAvailable: boolean, onEmergency: () => void) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<ActiveGuide>(null);
  const [transitioning, setTransitioning] = useState(false);
  const transitionLock = useRef(false);
  const flags = useRef<GuideFlags>({ onboarding: false, widget: false, emergency: false });
  const busy = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    loadGuideFlags().then((value) => { flags.current = value; }).catch(() => {
      // A read failure is not evidence of a fresh install. Avoid unsolicited overlays.
      flags.current = { onboarding: true, widget: true, emergency: true };
    }).finally(() => { if (mounted.current) setReady(true); });
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const remember = useCallback((key: keyof GuideFlags) => {
    flags.current[key] = true;
    void markGuideDone(key).catch(() => {
      // Keep the in-memory decision for this session; a future launch can retry.
      if (__DEV__) console.warn(`[guides] Failed to save ${key} preference`);
    });
  }, []);

  const afterSplash = useCallback(() => {
    if (!flags.current.onboarding) setActive('firstLaunch');
    else busy.current = false;
  }, []);

  const transition = useCallback((action: () => void) => {
    if (transitionLock.current) return;
    transitionLock.current = true;
    setTransitioning(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      transitionLock.current = false;
      setTransitioning(false);
      action();
    }, 350);
  }, []);

  const close = useCallback(() => {
    if (active === 'firstLaunch') remember('onboarding');
    if (active === 'widgetIntro') remember('widget');
    if (active === 'emergency') remember('emergency');
    setActive(null);
    // Let native modal dismissal finish before accepting another presentation.
    transition(() => { busy.current = false; });
  }, [active, remember, transition]);

  const openManual = useCallback((kind: 'manual' | 'widgetHowTo') => {
    if (busy.current || !ready || (kind === 'widgetHowTo' && !widgetAvailable)) return;
    busy.current = true;
    setActive(kind);
  }, [ready, widgetAvailable]);

  const favoriteAdded = useCallback(() => {
    if (!ready || busy.current || !widgetAvailable || flags.current.widget) return false;
    busy.current = true;
    // Reservation is synchronous, so rapid presses cannot schedule two guides.
    transition(() => {
      remember('widget');
      setActive('widgetIntro');
    });
    return true;
  }, [ready, widgetAvailable, remember, transition]);

  const openEmergency = useCallback(() => {
    if (!ready || busy.current) return;
    if (flags.current.emergency) onEmergency();
    else {
      busy.current = true;
      setActive('emergency');
    }
  }, [ready, onEmergency]);

  const continueEmergency = useCallback(() => {
    if (transitionLock.current) return;
    remember('emergency');
    setActive(null);
    transition(() => {
      busy.current = false;
      onEmergency();
    });
  }, [onEmergency, remember, transition]);

  const showWidgetHowTo = useCallback(() => {
    if (transitionLock.current) return;
    remember('widget');
    setActive(null);
    transition(() => setActive('widgetHowTo'));
  }, [remember, transition]);

  return { ready, active, transitioning, afterSplash, close, openManual, favoriteAdded, openEmergency, continueEmergency, showWidgetHowTo };
}
