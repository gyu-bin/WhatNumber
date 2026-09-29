import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Theme, ThemeColors } from '../../theme';
import { GuideButton, GuideModal } from './GuideSheet';
import { useGuideCopy } from './copy';

interface Props { colors: ThemeColors; theme: Theme; mode: 'firstLaunch' | 'manual'; widgetAvailable: boolean; onClose: () => void }

function Illustration({ page, colors, theme, widgetAvailable }: Pick<Props, 'colors' | 'theme' | 'widgetAvailable'> & { page: number }) {
  const c = useGuideCopy();
  const logo = <Image source={theme === 'dark' ? require('../../assets/brand/header-label-dark.png') : require('../../assets/brand/header-label-light.png')} resizeMode="contain" style={{ width: 132, height: 58 }} />;
  return <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={[styles.illustration, { backgroundColor: colors.heroBg }]}>
    {page === 0 ? <View style={[styles.phone, { borderColor: colors.textPrimary, backgroundColor: colors.surface }]}><View style={[styles.notch, { backgroundColor: colors.textPrimary }]} />{logo}<View style={[styles.phoneLine, { backgroundColor: colors.accentMuted }]} /><View style={[styles.phoneLine, { backgroundColor: colors.tipBg, width: 100 }]} /></View> : null}
    {page === 1 ? <View style={{ width: '100%', gap: 10 }}><Ionicons name="search" size={40} color={colors.accent} style={{ alignSelf: 'center' }} /><View style={[styles.search, { backgroundColor: colors.surface }]}><Ionicons name="search" size={20} color={colors.textSecondary} /><Text style={{ flex: 1, fontSize: 14, color: colors.textPrimary }}>{c.search}</Text></View><View style={styles.chips}>{c.chips.map(text => <View key={text} style={[styles.chip, { backgroundColor: colors.surface }]}><Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600' }}>{text}</Text></View>)}</View></View> : null}
    {page === 2 ? <View style={{ width: '100%', alignItems: 'center', gap: 10 }}><View style={styles.map}><View style={[styles.road, { backgroundColor: colors.surface }]} /><View style={[styles.road, { backgroundColor: colors.surface, transform: [{ rotate: '65deg' }] }]} /><Ionicons name="location" size={40} color={colors.accent} /><Ionicons name="medical" size={24} color={colors.accent} style={{ position: 'absolute', right: 34, top: 12 }} /></View><View style={[styles.search, { backgroundColor: colors.surface, width: '100%', flexDirection: 'column', gap: 4 }]}><Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>{c.nearby}</Text><Text style={{ fontSize: 12, color: colors.textSecondary }}>{c.map}</Text></View></View> : null}
    {page === 3 ? <View style={{ width: '100%', gap: 8 }}>
      <View style={[styles.widgetBadge, { backgroundColor: colors.accentMuted }]}><Ionicons name="phone-portrait-outline" size={14} color={colors.accent} /><Text style={{ color: colors.accent, fontSize: 12, fontWeight: '700' }}>{c.widgetHint}</Text></View>
      <View style={[styles.widget, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '800' }}>{c.favorites}</Text><Ionicons name="star" size={22} color={colors.favorite} /></View>
        {[['119', c.fire], ['112', c.police]].map(([number, label]) => <View key={number} style={[styles.widgetRow, { backgroundColor: colors.accentMuted }]}><Ionicons name="call" size={18} color={colors.accent} /><View style={{ flex: 1 }}><Text style={{ color: colors.accent, fontSize: 22, fontWeight: '800' }}>{number}</Text><Text style={{ color: colors.textSecondary, fontSize: 12 }}>{label}</Text></View></View>)}
      </View>
      {!widgetAvailable ? null : <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: 'center' }}>{c.widgetHowToDetail}</Text>}
    </View> : null}
  </View>;
}

export function FirstLaunchGuide({ colors, theme, mode, widgetAvailable, onClose }: Props) {
  const c = useGuideCopy();
  const pager = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(0);
  const [pageHeights, setPageHeights] = useState<number[]>([0, 0, 0, 0]);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReduceMotion(value); }).catch(() => {});
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; listener.remove(); };
  }, []);
  useEffect(() => { if (width) pager.current?.scrollTo({ x: width * page, animated: false }); }, [width]); // Preserve page on rotation.
  const move = (next: number) => { setPage(next); pager.current?.scrollTo({ x: width * next, animated: !reduceMotion }); };
  const back = () => { if (page > 0) move(page - 1); else if (mode === 'manual') onClose(); };
  const rememberHeight = (index: number, height: number) => {
    setPageHeights((prev) => {
      if (Math.abs((prev[index] ?? 0) - height) < 1) return prev;
      const next = [...prev];
      next[index] = height;
      return next;
    });
  };
  const pagerHeight = pageHeights[page] || undefined;
  return <GuideModal colors={colors} onBack={back} large>
    <View style={styles.top}><Text accessibilityLiveRegion="polite" accessibilityLabel={c.page(page + 1)} style={{ color: colors.textSecondary, fontSize: 14, fontWeight: '600' }}>{page + 1} / 4</Text>{page < 3 || mode === 'manual' ? <Pressable accessibilityRole="button" onPress={onClose} style={styles.skip}><Text style={{ color: colors.textSecondary, fontSize: 14 }}>{mode === 'manual' ? c.close : c.skip}</Text></Pressable> : <View style={styles.skip} />}</View>
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <ScrollView ref={pager} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={pagerHeight ? { height: pagerHeight } : undefined} onMomentumScrollEnd={event => { if (width) setPage(Math.max(0, Math.min(3, Math.round(event.nativeEvent.contentOffset.x / width)))); }}>
        {[0, 1, 2, 3].map(index => <View key={index} style={{ width: width || undefined, alignSelf: 'flex-start' }} importantForAccessibility={page === index ? 'auto' : 'no-hide-descendants'} accessibilityElementsHidden={page !== index}>
          <View style={styles.page} onLayout={event => rememberHeight(index, event.nativeEvent.layout.height)}>
            <Illustration page={index} colors={colors} theme={theme} widgetAvailable={widgetAvailable} />
            <Text accessibilityRole="header" style={[styles.title, { color: colors.textPrimary }]}>{c.titles[index]}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{c.descriptions[index]}</Text>
            {index === 2 ? <Text style={[styles.note, { color: colors.textSecondary }]}>{c.privacy}</Text> : null}
            {index === 3 && !widgetAvailable ? <Text style={[styles.note, { color: colors.textSecondary }]}>{c.widgetPreviewNote}</Text> : null}
          </View>
        </View>)}
      </ScrollView>
    </View>
    <View accessible accessibilityLabel={c.page(page + 1)} style={styles.dots}>{[0, 1, 2, 3].map(index => <View key={index} style={{ height: 8, width: page === index ? 20 : 8, borderRadius: 4, backgroundColor: page === index ? colors.accent : colors.divider }} />)}</View>
    <Text style={[styles.revisit, { color: colors.textSecondary }]}>{c.revisit}</Text>
    <View style={styles.actions}>{page > 0 ? <View style={{ flex: 1 }}><GuideButton colors={colors} secondary label={c.previous} onPress={() => move(page - 1)} /></View> : null}<View style={{ flex: 1 }}><GuideButton colors={colors} label={page < 3 ? c.next : mode === 'firstLaunch' ? c.start : c.done} onPress={() => page < 3 ? move(page + 1) : onClose()} /></View></View>
  </GuideModal>;
}
const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 6, paddingTop: 10 },
  skip: { minWidth: 74, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  page: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 0, gap: 8 },
  illustration: { minHeight: 148, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  phone: { width: 128, height: 148, borderRadius: 20, borderWidth: 3, alignItems: 'center', paddingTop: 8, transform: [{ rotate: '7deg' }] },
  notch: { width: 36, height: 7, borderRadius: 8, marginBottom: 8 },
  phoneLine: { height: 9, width: 90, borderRadius: 5, marginTop: 5 },
  search: { borderRadius: 16, minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  map: { height: 64, width: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  road: { width: '120%', height: 14, position: 'absolute', transform: [{ rotate: '-20deg' }] },
  widget: { width: '100%', padding: 12, borderRadius: 18, borderWidth: 1, gap: 8 },
  widgetBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  widgetRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 9, borderRadius: 12 },
  title: { fontSize: 22, lineHeight: 30, fontWeight: '800', letterSpacing: -0.7 },
  description: { fontSize: 15, lineHeight: 22 },
  note: { fontSize: 12, lineHeight: 18 },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 12, paddingBottom: 2 },
  revisit: { textAlign: 'center', fontSize: 12, marginHorizontal: 20, marginTop: 2, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 2 },
});
