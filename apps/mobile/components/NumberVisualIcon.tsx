import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CAT_COLOR, type NumberItem } from '@whatnumber/shared';
import { getNumberIonicon, getNumberLogoSource } from '../services/numberVisuals';

export function NumberVisualIcon({
  item,
  size = 44,
  iconSize,
}: {
  item: NumberItem;
  size?: number;
  iconSize?: number;
}) {
  const logo = getNumberLogoSource(item);
  const radius = Math.round(size * 0.32);
  const glyph = iconSize ?? Math.round(size * 0.45);

  if (logo) {
    return (
      <Image
        source={logo}
        style={{ width: size, height: size, borderRadius: radius }}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: `${CAT_COLOR[item.cat]}1A`,
        },
      ]}
    >
      <Ionicons name={getNumberIonicon(item)} size={glyph} color={CAT_COLOR[item.cat]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
