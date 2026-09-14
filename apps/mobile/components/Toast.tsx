import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppStyles } from '../styles';

export function Toast({
  message,
  visible,
  styles,
  onHide,
  durationMs = 2200,
}: {
  message: string | null;
  visible: boolean;
  styles: AppStyles;
  onHide: () => void;
  durationMs?: number;
}) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (!visible || !message) return;

    opacity.setValue(0);
    translateY.setValue(12);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const hideTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onHide();
      });
    }, durationMs);

    return () => clearTimeout(hideTimer);
  }, [visible, message, durationMs, onHide, opacity, translateY]);

  if (!visible || !message) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.toastWrap, { bottom: Math.max(insets.bottom, 12) + 64 }]}
    >
      <Animated.View
        style={[
          styles.toast,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    </View>
  );
}
