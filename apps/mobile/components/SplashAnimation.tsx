import { useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { getThemeColors, type Theme } from '../theme';
import i18n from '../i18n';

/** Brand label asset aspect ≈ 2054×766 */
const LOGO_ASPECT = 2054 / 766;

/**
 * Soft per-segment progress (~2.4s).
 * Each beat holds on-screen before the next asset takes over.
 *
 * 0.00→0.07  STEP1 dot appear     200ms
 * 0.07→0.12  hold dot             160ms
 * 0.12→0.24  STEP2 expand         240ms
 * 0.24→0.28  hold expanded        120ms
 * 0.28→0.44  STEP3 morph          320ms
 * 0.44→0.50  hold morph           180ms
 * 0.50→0.62  STEP4 logo           280ms
 * 0.62→0.68  hold logo            180ms
 * 0.68→0.78  STEP5 tagline        240ms
 * 0.78→0.86  hold complete        200ms
 * 0.86→1.00  STEP6 exit           360ms
 */
const SEGMENTS: { to: number; duration: number; easing: (t: number) => number }[] = [
  { to: 0.07, duration: 200, easing: Easing.out(Easing.cubic) },
  { to: 0.12, duration: 160, easing: Easing.linear },
  { to: 0.24, duration: 240, easing: Easing.out(Easing.cubic) },
  { to: 0.28, duration: 120, easing: Easing.linear },
  { to: 0.44, duration: 320, easing: Easing.out(Easing.cubic) },
  { to: 0.5, duration: 180, easing: Easing.linear },
  { to: 0.62, duration: 280, easing: Easing.out(Easing.cubic) },
  { to: 0.68, duration: 180, easing: Easing.linear },
  { to: 0.78, duration: 240, easing: Easing.out(Easing.cubic) },
  { to: 0.86, duration: 200, easing: Easing.linear },
  { to: 1, duration: 360, easing: Easing.inOut(Easing.cubic) },
];

const TOTAL_MS = SEGMENTS.reduce((sum, s) => sum + s.duration, 0);
const EXIT_AT_MS = SEGMENTS.slice(0, -1).reduce((sum, s) => sum + s.duration, 0);

type Props = {
  theme: Theme;
  /** Native splash가 숨겨진 뒤에 true — 이때부터 타임라인 시작 */
  active: boolean;
  onTransitionStart?: () => void;
  onFinish: () => void;
};

function clampRange(progress: Animated.Value, start: number, end: number) {
  return progress.interpolate({
    inputRange: [start, end],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
}

/**
 * Cold-start brand intro (storyboard 01→06, ~2.4s).
 * Does not re-run on background → foreground; App owns that policy.
 */
export function SplashAnimation({ theme, active, onTransitionStart, onFinish }: Props) {
  const colors = getThemeColors(theme);
  const bg = theme === 'dark' ? colors.bg : '#FCFBFA';
  const coral = colors.accent;
  const taglineColor = colors.textSecondary;

  const screenW = Dimensions.get('window').width;
  const logoW = Math.min(screenW * 0.54, 248);
  const logoH = logoW / LOGO_ASPECT;
  const morphW = logoW * 0.92;
  const morphH = logoH * 0.78;

  const brandLogo = useMemo(
    () =>
      theme === 'dark'
        ? require('../assets/brand/header-label-dark.png')
        : require('../assets/brand/header-label-light.png'),
    [theme],
  );

  const progress = useRef(new Animated.Value(0)).current;
  const transitionStartedRef = useRef(false);
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  const onTransitionStartRef = useRef(onTransitionStart);
  onFinishRef.current = onFinish;
  onTransitionStartRef.current = onTransitionStart;

  // —— Exit (0.86→1) ——
  const overlayOpacity = progress.interpolate({
    inputRange: [0.86, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const groupOpacity = progress.interpolate({
    inputRange: [0.86, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const groupTY = progress.interpolate({
    inputRange: [0.86, 1],
    outputRange: [0, -8],
    extrapolate: 'clamp',
  });
  const groupScale = progress.interpolate({
    inputRange: [0.86, 1],
    outputRange: [1, 0.98],
    extrapolate: 'clamp',
  });

  const decoOpacity = progress.interpolate({
    inputRange: [0.02, 0.14, 0.86, 1],
    outputRange: [0, 0.04, 0.04, 0],
    extrapolate: 'clamp',
  });
  const decoOpacityBR = progress.interpolate({
    inputRange: [0.02, 0.14, 0.86, 1],
    outputRange: [0, 0.035, 0.035, 0],
    extrapolate: 'clamp',
  });

  // STEP 1–2: dot — visible through expand hold, fades as morph starts
  const dotOpacity = progress.interpolate({
    inputRange: [0, 0.05, 0.28, 0.36],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const dotScale = progress.interpolate({
    inputRange: [0, 0.07, 0.12, 0.24],
    outputRange: [0, 1, 1, 2.45],
    extrapolate: 'clamp',
  });

  const haloOpacity = progress.interpolate({
    inputRange: [0.12, 0.17, 0.24],
    outputRange: [0, 0.1, 0],
    extrapolate: 'clamp',
  });
  const haloScale = progress.interpolate({
    inputRange: [0.12, 0.24],
    outputRange: [0.85, 2.7],
    extrapolate: 'clamp',
  });

  // STEP 3: morph — fully formed by 0.44, held until 0.50, then crossfade out
  const morphOpacity = progress.interpolate({
    inputRange: [0.26, 0.34, 0.5, 0.58],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const morphScale = progress.interpolate({
    inputRange: [0.28, 0.44],
    outputRange: [0.2, 1],
    extrapolate: 'clamp',
  });
  const morphScaleX = progress.interpolate({
    inputRange: [0.28, 0.44],
    outputRange: [1, 1.06],
    extrapolate: 'clamp',
  });
  const tailOpacity = progress.interpolate({
    inputRange: [0.34, 0.42, 0.5, 0.58],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const secondaryOpacity = progress.interpolate({
    inputRange: [0.38, 0.46, 0.52, 0.58],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const secondaryTX = progress.interpolate({
    inputRange: [0.38, 0.46],
    outputRange: [-6, 0],
    extrapolate: 'clamp',
  });
  const secondaryScale = progress.interpolate({
    inputRange: [0.38, 0.46],
    outputRange: [0.94, 1],
    extrapolate: 'clamp',
  });

  const ray1 = progress.interpolate({
    inputRange: [0.36, 0.42, 0.52, 0.58],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const ray2 = progress.interpolate({
    inputRange: [0.38, 0.44, 0.52, 0.58],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const ray3 = progress.interpolate({
    inputRange: [0.4, 0.46, 0.52, 0.58],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });
  const rayScale1 = clampRange(progress, 0.36, 0.42);
  const rayScale2 = clampRange(progress, 0.38, 0.44);
  const rayScale3 = clampRange(progress, 0.4, 0.46);

  // STEP 4: logo — in by 0.62, held through 0.68
  const logoOpacity = progress.interpolate({
    inputRange: [0.5, 0.62],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const logoScale = progress.interpolate({
    inputRange: [0.5, 0.62],
    outputRange: [0.97, 1],
    extrapolate: 'clamp',
  });

  // STEP 5: tagline — in by 0.78, held until exit
  const tagOpacity = progress.interpolate({
    inputRange: [0.68, 0.78],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const tagTY = progress.interpolate({
    inputRange: [0.68, 0.78],
    outputRange: [8, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Image.resolveAssetSource(brandLogo);
    Image.prefetch(Image.resolveAssetSource(brandLogo).uri).catch(() => undefined);
  }, [brandLogo]);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let running: Animated.CompositeAnimation | null = null;
    transitionStartedRef.current = false;
    finishedRef.current = false;
    progress.setValue(0);

    const finish = () => {
      if (cancelled || finishedRef.current) return;
      finishedRef.current = true;
      onFinishRef.current();
    };

    const startHome = () => {
      if (cancelled || transitionStartedRef.current) return;
      transitionStartedRef.current = true;
      onTransitionStartRef.current?.();
    };

    const runFull = () => {
      timers.push(setTimeout(startHome, EXIT_AT_MS));

      running = Animated.sequence(
        SEGMENTS.map((seg) =>
          Animated.timing(progress, {
            toValue: seg.to,
            duration: seg.duration,
            easing: seg.easing,
            useNativeDriver: true,
          }),
        ),
      );
      running.start(({ finished: animFinished }) => {
        if (cancelled) return;
        startHome();
        if (animFinished) finish();
        else finish();
      });
    };

    /** Reduce Motion: logo → tagline → soft exit (~800ms) */
    const runReduced = () => {
      const reducedMs = 800;
      progress.setValue(0.5);
      timers.push(
        setTimeout(
          startHome,
          Math.round(reducedMs * ((0.86 - 0.5) / (1 - 0.5))),
        ),
      );

      running = Animated.timing(progress, {
        toValue: 1,
        duration: reducedMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      running.start(() => {
        if (cancelled) return;
        startHome();
        finish();
      });
    };

    const start = () => {
      if (cancelled) return;
      AccessibilityInfo.isReduceMotionEnabled()
        .then((enabled) => {
          if (cancelled) return;
          (enabled ? runReduced : runFull)();
        })
        .catch(() => {
          if (!cancelled) runFull();
        });
    };

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(start);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      timers.forEach(clearTimeout);
      running?.stop();
      progress.stopAnimation();
    };
  }, [active, progress]);

  return (
    <Animated.View
      style={[styles.overlay, { backgroundColor: bg, opacity: overlayOpacity }]}
      pointerEvents="auto"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[styles.decoTL, { backgroundColor: coral, opacity: decoOpacity }]}
        pointerEvents="none"
      />
      <Animated.View
        style={[styles.decoBR, { backgroundColor: coral, opacity: decoOpacityBR }]}
        pointerEvents="none"
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: groupOpacity,
            transform: [{ translateY: groupTY }, { scale: groupScale }],
          },
        ]}
      >
        <View style={[styles.logoStage, { width: logoW + 36, height: logoH + 28 }]}>
          <Animated.View
            style={[
              styles.halo,
              {
                backgroundColor: coral,
                opacity: haloOpacity,
                transform: [{ scale: haloScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: coral,
                opacity: dotOpacity,
                transform: [{ scale: dotScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.secondaryBubble,
              {
                backgroundColor: theme === 'dark' ? '#3A3A3A' : '#EFEFED',
                opacity: secondaryOpacity,
                transform: [
                  { translateX: secondaryTX },
                  { scale: secondaryScale },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.morphWrap,
              {
                width: morphW,
                height: morphH,
                opacity: morphOpacity,
                transform: [{ scale: morphScale }, { scaleX: morphScaleX }],
              },
            ]}
          >
            <View
              style={[
                styles.morphBody,
                {
                  backgroundColor: coral,
                  borderRadius: morphH / 2,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.morphTail,
                { backgroundColor: coral, opacity: tailOpacity },
              ]}
            />
          </Animated.View>

          <View style={[styles.rays, { right: 8, top: logoH * 0.02 }]} pointerEvents="none">
            <Animated.View
              style={[
                styles.ray,
                styles.ray1,
                {
                  backgroundColor: coral,
                  opacity: ray1,
                  transform: [{ rotate: '-70deg' }, { scale: rayScale1 }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ray,
                styles.ray2,
                {
                  backgroundColor: coral,
                  opacity: ray2,
                  transform: [{ rotate: '-38deg' }, { scale: rayScale2 }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ray,
                styles.ray3,
                {
                  backgroundColor: coral,
                  opacity: ray3,
                  transform: [{ rotate: '-8deg' }, { scale: rayScale3 }],
                },
              ]}
            />
          </View>

          <Animated.Image
            source={brandLogo}
            style={{
              width: logoW,
              height: logoH,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              color: taglineColor,
              opacity: tagOpacity,
              transform: [{ translateY: tagTY }],
            },
          ]}
          allowFontScaling={false}
        >
          {i18n.t('home.subtitle')}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  decoTL: {
    position: 'absolute',
    top: -120,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  decoBR: {
    position: 'absolute',
    right: -110,
    bottom: -130,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  logoStage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  secondaryBubble: {
    position: 'absolute',
    right: 6,
    top: '28%',
    width: 42,
    height: 28,
    borderRadius: 14,
    zIndex: 0,
  },
  morphWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  morphBody: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  morphTail: {
    position: 'absolute',
    left: 22,
    bottom: -7,
    width: 18,
    height: 18,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  rays: {
    position: 'absolute',
    width: 34,
    height: 34,
    zIndex: 2,
  },
  ray: {
    position: 'absolute',
    width: 12,
    height: 3.5,
    borderRadius: 2,
  },
  ray1: { left: 2, top: 0 },
  ray2: { left: 9, top: 9 },
  ray3: { left: 14, top: 18 },
  tagline: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

// Exported for tests / sync with App home transition
export const SPLASH_EXIT_MS = SEGMENTS[SEGMENTS.length - 1]!.duration;
export const SPLASH_TOTAL_MS = TOTAL_MS;
