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
const RISE_FROM = 280;
const EXIT_AT = 2_400;
const TOTAL_DURATION = 3_100;

type Props = {
  theme: Theme;
  /** Native splash가 숨겨진 뒤에 true — 이때부터 타임라인 시작 */
  active: boolean;
  onTransitionStart?: () => void;
  onFinish: () => void;
};

/**
 * Cold-start brand intro: coral bubble rises from the bottom to center.
 */
export function SplashAnimation({ theme, active, onTransitionStart, onFinish }: Props) {
  const bg = theme === 'dark' ? BG_DARK : BG_LIGHT;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const riseY = useRef(new Animated.Value(RISE_FROM)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitTY = useRef(new Animated.Value(0)).current;
  const exitScale = useRef(new Animated.Value(1)).current;
  const ray1 = useRef(new Animated.Value(0)).current;
  const ray2 = useRef(new Animated.Value(0)).current;
  const ray3 = useRef(new Animated.Value(0)).current;
  const ray1Scale = useRef(new Animated.Value(0.4)).current;
  const ray2Scale = useRef(new Animated.Value(0.4)).current;
  const ray3Scale = useRef(new Animated.Value(0.4)).current;
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const animations: Animated.CompositeAnimation[] = [];
    const easeOut = Easing.out(Easing.cubic);
    const easeBack = Easing.out(Easing.back(1.35));

    const reset = () => {
      overlayOpacity.setValue(1);
      logoOpacity.setValue(0);
      logoScale.setValue(0.92);
      riseY.setValue(RISE_FROM);
      exitOpacity.setValue(1);
      exitTY.setValue(0);
      exitScale.setValue(1);
      [ray1, ray2, ray3].forEach((ray) => ray.setValue(0));
      [ray1Scale, ray2Scale, ray3Scale].forEach((scale) => scale.setValue(0.4));
    };

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
              duration: 180,
              easing: easeOut,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 200,
              easing: easeBack,
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
          Animated.timing(exitOpacity, {
            toValue: 0,
            duration,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(exitScale, {
            toValue: 0.9,
            duration,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(exitTY, {
            toValue: moveUp ? -56 : 0,
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

    const runRise = () => {
      run(
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 280,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(riseY, {
            toValue: 0,
            duration: 820,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(logoScale, {
              toValue: 1.05,
              duration: 820,
              easing: easeOut,
              useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
              toValue: 1,
              duration: 240,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      popRay(ray1, ray1Scale, 860);
      popRay(ray2, ray2Scale, 1_000);
      popRay(ray3, ray3Scale, 1_140);

      schedule(() => exit(TOTAL_DURATION - EXIT_AT, true), EXIT_AT);
      schedule(finish, TOTAL_DURATION);
    };

    const runReducedMotion = () => {
      run(
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 360,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(riseY, {
            toValue: 0,
            duration: 360,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 360,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(ray1, { toValue: 1, duration: 360, easing: easeOut, useNativeDriver: true }),
          Animated.timing(ray2, { toValue: 1, duration: 360, easing: easeOut, useNativeDriver: true }),
          Animated.timing(ray3, { toValue: 1, duration: 360, easing: easeOut, useNativeDriver: true }),
        ]),
      );
      ray1Scale.setValue(1);
      ray2Scale.setValue(1);
      ray3Scale.setValue(1);
      schedule(() => exit(320, false), 1_200);
      schedule(finish, 1_560);
    };

    reset();

    const start = () => {
      if (cancelled) return;
      AccessibilityInfo.isReduceMotionEnabled()
        .then((enabled) => {
          if (!cancelled) (enabled ? runReducedMotion : runRise)();
        })
        .catch(() => {
          if (!cancelled) runRise();
        });
    };

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(start);
      timers.push(raf2 as unknown as ReturnType<typeof setTimeout>);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      timers.forEach((id) => {
        clearTimeout(id);
        cancelAnimationFrame(id as unknown as number);
      });
      animations.forEach((animation) => animation.stop());
      startedRef.current = false;
    };
  }, [
    active,
    exitOpacity,
    exitScale,
    exitTY,
    logoOpacity,
    logoScale,
    onFinish,
    onTransitionStart,
    overlayOpacity,
    ray1,
    ray1Scale,
    ray2,
    ray2Scale,
    ray3,
    ray3Scale,
    riseY,
  ]);

  return (
    <Animated.View
      style={[styles.overlay, { backgroundColor: bg, opacity: overlayOpacity }]}
      pointerEvents="auto"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          styles.exitWrap,
          {
            opacity: exitOpacity,
            transform: [{ translateY: exitTY }, { scale: exitScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.group,
            {
              opacity: logoOpacity,
              transform: [
                { translateX: -22 },
                { translateY: riseY },
                { scale: logoScale },
                { rotate: '-4deg' },
              ],
            },
          ]}
        >
          <View style={styles.bubbleShadow}>
            <View style={styles.bubble}>
              <Text style={styles.logoText} allowFontScaling={false}>
                몇번이야?
              </Text>
              <View style={styles.tail} />
            </View>
          </View>

          <View style={styles.rays} pointerEvents="none">
            <Animated.View
              style={[
                styles.ray,
                styles.ray1,
                { opacity: ray1, transform: [{ rotate: '-70deg' }, { scale: ray1Scale }] },
              ]}
            />
            <Animated.View
              style={[
                styles.ray,
                styles.ray2,
                { opacity: ray2, transform: [{ rotate: '-38deg' }, { scale: ray2Scale }] },
              ]}
            />
            <Animated.View
              style={[
                styles.ray,
                styles.ray3,
                { opacity: ray3, transform: [{ rotate: '-8deg' }, { scale: ray3Scale }] },
              ]}
            />
          </View>
        </Animated.View>
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
  exitWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    width: BUBBLE_W + 60,
    height: BUBBLE_H + 62,
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
    right: 14,
    top: 2,
    width: 34,
    height: 34,
  },
  ray: {
    position: 'absolute',
    width: 13,
    height: 4,
    borderRadius: 2,
    backgroundColor: CORAL,
  },
  ray1: { left: 2, top: 0 },
  ray2: { left: 9, top: 9 },
  ray3: { left: 14, top: 18 },
});
