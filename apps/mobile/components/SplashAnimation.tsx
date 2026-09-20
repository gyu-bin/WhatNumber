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

type Props = {
  theme: Theme;
  active: boolean;
  onTransitionStart?: () => void;
  onFinish: () => void;
};

/**
 * Cold-start brand intro.
 * Uses separate Animated values (native-driver safe) — avoids a single
 * progress tree that can crash some release builds on reload.
 */
export function SplashAnimation({ theme, active, onTransitionStart, onFinish }: Props) {
  const colors = getThemeColors(theme);
  const bg = theme === 'dark' ? colors.bg : '#FCFBFA';
  const coral = colors.accent;
  const taglineColor = colors.textSecondary;

  const screenW = Dimensions.get('window').width;
  const logoW = Math.min(screenW * 0.54, 248);
  const logoH = logoW / LOGO_ASPECT;

  const brandLogo = useMemo(
    () =>
      theme === 'dark'
        ? require('../assets/brand/header-label-dark.png')
        : require('../assets/brand/header-label-light.png'),
    [theme],
  );

  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const groupOpacity = useRef(new Animated.Value(1)).current;
  const groupTY = useRef(new Animated.Value(0)).current;

  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.96)).current;

  const tagOpacity = useRef(new Animated.Value(0)).current;
  const tagTY = useRef(new Animated.Value(8)).current;

  const onFinishRef = useRef(onFinish);
  const onTransitionStartRef = useRef(onTransitionStart);
  onFinishRef.current = onFinish;
  onTransitionStartRef.current = onTransitionStart;

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    const easeOut = Easing.out(Easing.cubic);
    const animations: Animated.CompositeAnimation[] = [];

    const run = (animation: Animated.CompositeAnimation) => {
      animations.push(animation);
      animation.start();
    };

    const finish = () => {
      if (!cancelled) onFinishRef.current();
    };

    const startExit = () => {
      if (cancelled) return;
      onTransitionStartRef.current?.();
      run(
        Animated.parallel([
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 320,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(groupOpacity, {
            toValue: 0,
            duration: 320,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(groupTY, {
            toValue: -6,
            duration: 320,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const runFull = () => {
      // Dot in
      run(
        Animated.parallel([
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 180,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(dotScale, {
            toValue: 1,
            duration: 180,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
      );

      // Expand → crossfade to logo
      const expandAndLogo = Animated.sequence([
        Animated.delay(280),
        Animated.timing(dotScale, {
          toValue: 2.4,
          duration: 260,
          easing: easeOut,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(dotOpacity, {
            toValue: 0,
            duration: 200,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 280,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 280,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(220),
        Animated.parallel([
          Animated.timing(tagOpacity, {
            toValue: 1,
            duration: 240,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(tagTY, {
            toValue: 0,
            duration: 240,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(400),
      ]);

      animations.push(expandAndLogo);
      expandAndLogo.start(({ finished }) => {
        if (cancelled || !finished) {
          finish();
          return;
        }
        startExit();
        setTimeout(finish, 340);
      });
    };

    const runReduced = () => {
      logoOpacity.setValue(1);
      logoScale.setValue(1);
      tagOpacity.setValue(1);
      tagTY.setValue(0);
      const wait = Animated.delay(500);
      animations.push(wait);
      wait.start(() => {
        if (cancelled) return;
        startExit();
        setTimeout(finish, 340);
      });
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) (enabled ? runReduced : runFull)();
      })
      .catch(() => {
        if (!cancelled) runFull();
      });

    return () => {
      cancelled = true;
      animations.forEach((a) => a.stop());
    };
  }, [
    active,
    dotOpacity,
    dotScale,
    groupOpacity,
    groupTY,
    logoOpacity,
    logoScale,
    overlayOpacity,
    tagOpacity,
    tagTY,
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
          styles.content,
          {
            opacity: groupOpacity,
            transform: [{ translateY: groupTY }],
          },
        ]}
      >
        <View style={[styles.logoStage, { width: logoW, height: logoH }]}>
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
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  tagline: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
