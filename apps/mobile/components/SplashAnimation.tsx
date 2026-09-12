import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Theme } from '../theme';

const CORAL = '#FF5A55';
const BG_LIGHT = '#FCFBFA';
const BG_DARK = '#171717';
const BUBBLE_W = 246;
const BUBBLE_H = 78;
const EXIT_AT = 1_400;
const TOTAL_DURATION = 2_000;

type Props = {
  theme: Theme;
  /** Native splash가 숨겨진 뒤에 true — 이때부터 타임라인 시작 */
  active: boolean;
  onTransitionStart?: () => void;
  onFinish: () => void;
};

/**
 * Cold-start brand intro: Minimal Pop (2.0s).
 * The completed wordmark appears as one group; no dot-to-bubble transformation.
 */
export function SplashAnimation({ theme, active, onTransitionStart, onFinish }: Props) {
  const bg = theme === 'dark' ? BG_DARK : BG_LIGHT;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.78)).current;
  const groupOpacity = useRef(new Animated.Value(1)).current;
  const groupTY = useRef(new Animated.Value(0)).current;
  const groupScale = useRef(new Animated.Value(1)).current;
  const ray1 = useRef(new Animated.Value(0)).current;
  const ray2 = useRef(new Animated.Value(0)).current;
  const ray3 = useRef(new Animated.Value(0)).current;
  const ray1Scale = useRef(new Animated.Value(0.5)).current;
  const ray2Scale = useRef(new Animated.Value(0.5)).current;
  const ray3Scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const animations: Animated.CompositeAnimation[] = [];
    const easeOut = Easing.out(Easing.cubic);

    // Makes Fast Refresh and each cold start deterministic.
    overlayOpacity.setValue(1);
    logoOpacity.setValue(0);
    logoScale.setValue(0.78);
    groupOpacity.setValue(1);
    groupTY.setValue(0);
    groupScale.setValue(1);
    [ray1, ray2, ray3].forEach((ray) => ray.setValue(0));
    [ray1Scale, ray2Scale, ray3Scale].forEach((scale) => scale.setValue(0.5));

    const schedule = (callback: () => void, delay: number) => {
      timers.push(setTimeout(callback, delay));
    };
    const run = (animation: Animated.CompositeAnimation) => {
      animations.push(animation);
      animation.start();
    };
    const finish = () => {
      if (!cancelled) onFinish();
    };
    const popRay = (opacity: Animated.Value, scale: Animated.Value, delay: number) => {
      schedule(() => {
        run(
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 150,
              easing: easeOut,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 150,
              easing: easeOut,
              useNativeDriver: true,
            }),
          ]),
        );
      }, delay);
    };
    const exit = (duration: number, moveUp: boolean) => {
      if (!cancelled) onTransitionStart?.();
      run(
        Animated.parallel([
          Animated.timing(groupOpacity, {
            toValue: 0,
            duration,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(groupScale, {
            toValue: 0.84,
            duration,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(groupTY, {
            toValue: moveUp ? -72 : 0,
            duration,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
      );
    };
    const runMinimalPop = () => {
      // 0–530ms: the completed wordmark arrives as one confident pop.
      run(
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 230,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(logoScale, {
              toValue: 1.1,
              duration: 360,
              easing: easeOut,
              useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
              toValue: 1,
              duration: 170,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      // 330–670ms: the three accent rays land one after another.
      popRay(ray1, ray1Scale, 330);
      popRay(ray2, ray2Scale, 440);
      popRay(ray3, ray3Scale, 550);

      // 670–1120ms: leave enough time for the mark to register.
      schedule(() => exit(TOTAL_DURATION - EXIT_AT, true), EXIT_AT);
      schedule(finish, TOTAL_DURATION);
    };
    const runReducedMotion = () => {
      run(
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 180,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 180,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(ray1, { toValue: 1, duration: 180, easing: easeOut, useNativeDriver: true }),
          Animated.timing(ray2, { toValue: 1, duration: 180, easing: easeOut, useNativeDriver: true }),
          Animated.timing(ray3, { toValue: 1, duration: 180, easing: easeOut, useNativeDriver: true }),
        ]),
      );
      ray1Scale.setValue(1);
      ray2Scale.setValue(1);
      ray3Scale.setValue(1);
      schedule(() => exit(180, false), 420);
      schedule(finish, 600);
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) (enabled ? runReducedMotion : runMinimalPop)();
      })
      .catch(() => {
        if (!cancelled) runMinimalPop();
      });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      animations.forEach((animation) => animation.stop());
    };
  }, [active]);

  return (
    <Animated.View
      style={[styles.overlay, { backgroundColor: bg, opacity: overlayOpacity }]}
      pointerEvents="auto"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          styles.group,
          {
            opacity: groupOpacity,
            transform: [
              { translateX: -22 },
              { translateY: groupTY },
              { scale: groupScale },
              { rotate: '-4deg' },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoGroup,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.bubbleShadow}>
            <View style={styles.bubble}>
              <Text style={styles.logoText}>몇번이야?</Text>
              <View style={styles.tail} />
            </View>
          </View>

          <View style={styles.rays} pointerEvents="none">
            <Animated.View
              style={[styles.ray, styles.ray1, { opacity: ray1, transform: [{ rotate: '-70deg' }, { scale: ray1Scale }] }]}
            />
            <Animated.View
              style={[styles.ray, styles.ray2, { opacity: ray2, transform: [{ rotate: '-38deg' }, { scale: ray2Scale }] }]}
            />
            <Animated.View
              style={[styles.ray, styles.ray3, { opacity: ray3, transform: [{ rotate: '-8deg' }, { scale: ray3Scale }] }]}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    width: BUBBLE_W + 60,
    height: BUBBLE_H + 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 6,
  },
  bubble: {
    width: BUBBLE_W,
    height: BUBBLE_H,
    borderRadius: BUBBLE_H / 2,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tail: {
    position: 'absolute',
    left: 28,
    bottom: -8,
    width: 21,
    height: 21,
    borderRadius: 4,
    backgroundColor: CORAL,
    transform: [{ rotate: '45deg' }],
  },
  logoText: {
    color: '#fff',
    fontSize: 33,
    fontWeight: '800',
    letterSpacing: -0.8,
    includeFontPadding: false,
  },
  rays: {
    position: 'absolute',
    right: -29,
    top: -32,
    width: 56,
    height: 56,
  },
  ray: {
    position: 'absolute',
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: CORAL,
  },
  ray1: { left: 8, top: 2 },
  ray2: { left: 18, top: 14 },
  ray3: { left: 24, top: 29 },
});
