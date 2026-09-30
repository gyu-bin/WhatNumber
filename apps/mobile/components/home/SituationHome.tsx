import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALL_NUMBERS, type NumberItem } from '@whatnumber/shared';
import type { ThemeColors } from '../../theme';
import { getCurrentSeasons, HOME_SITUATIONS, type HomeSituationId } from '../../data/homeContent';
import { useHomeCopy } from './copy';

export type SituationHomeProps = {
  colors: ThemeColors;
  items: NumberItem[];
  onSelectItem: (item: NumberItem) => void;
  onCall: (item: NumberItem) => void;
  onAdd: () => void;
  onShowSaved: () => void;
  onSituation: (id: HomeSituationId) => void;
  onEmergency: () => void;
  onSeason: (id: string) => void;
  onAllSeasons: () => void;
  onCategories: () => void;
};

/** Presentational home body. All navigation and calling remain owned by App. */
export function SituationHome(props: SituationHomeProps) {
  const { colors, items } = props;
  const c = useHomeCopy();
  const [width, setWidth] = useState(340);
  const seasons = getCurrentSeasons();
  const surface = { backgroundColor: colors.surface, borderColor: colors.border };
  const text = { color: colors.textPrimary };
  const secondary = { color: colors.textSecondary };
  const all = (title: string, onPress: () => void) => (
    <View style={s.sectionHeader}>
      <Text style={[s.sectionTitle, text]}>{title}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`${title}, ${c.all}`} onPress={onPress} style={s.all}>
        <Text style={[s.allText, secondary]}>{c.all}</Text><Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
  return (
    <View style={s.root} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {items.length > 0 && <View>
        {all(c.saved, props.onShowSaved)}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontal}>
          {items.slice(0, 6).map((item) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.title}, ${item.num}`} accessibilityHint={c.savedHint} onPress={() => props.onCall(item)} onLongPress={() => props.onSelectItem(item)} style={[s.saved, surface, { width: Math.max(82, (width - 30) / 4) }]}>
            <Text style={s.savedIcon} accessible={false}>{item.icon}</Text>
            <Text numberOfLines={2} style={[s.savedTitle, text]}>{item.title}</Text>
            <Text style={[s.savedNumber, secondary]}>{item.num}</Text>
          </Pressable>)}
          <Pressable accessibilityRole="button" accessibilityLabel={c.register} onPress={props.onAdd} style={[s.saved, surface, { width: 72 }]}>
            <Ionicons name="add-circle" size={30} color="#13A98C" /><Text style={[s.savedTitle, secondary]}>{c.add}</Text>
          </Pressable>
        </ScrollView>
      </View>}
      <View style={s.grid}>
        {HOME_SITUATIONS.map((item) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${c.situations[item.id].title}, ${c.situations[item.id].detail}`} onPress={() => props.onSituation(item.id)} style={({ pressed }) => [s.tile, surface, { opacity: pressed ? 0.72 : 1 }]}>
          <Ionicons name={item.icon} size={32} color={item.accent} />
          <Text style={[s.tileTitle, text]}>{c.situations[item.id].title}</Text>
          <Text style={[s.tileDetail, secondary]}>{c.situations[item.id].detail}</Text>
        </Pressable>)}
      </View>
      <View style={s.emergencyRow}>
        {([{ id: 'e2', color: '#F24E57', label: c.fire }, { id: 'e3', color: '#1685EF', label: c.police }]).map((entry) => {
          const item = ALL_NUMBERS.find((number) => number.id === entry.id);
          return item && <Pressable key={entry.id} accessibilityRole="button" accessibilityLabel={`${item.num}, ${entry.label}`} onPress={() => props.onCall(item)} style={({ pressed }) => [s.emergencyButton, { backgroundColor: entry.color, opacity: pressed ? 0.75 : 1 }]}>
            <View style={s.phoneCircle}><Ionicons name="call" size={22} color={entry.color} /></View>
            <View style={s.flex}><Text style={s.emergencyNumber}>{item.num}</Text><Text style={s.emergencyLabel}>{entry.label}</Text></View>
          </Pressable>;
        })}
      </View>
      <Pressable accessibilityRole="button" onPress={props.onEmergency} style={({ pressed }) => [s.cta, surface, { opacity: pressed ? 0.7 : 1 }]}>
        <View style={[s.ctaIcon, { backgroundColor: colors.accentMuted }]}><Ionicons name="location" size={25} color={colors.accent} /></View>
        <Text style={[s.ctaTitle, text]}>{c.emergency}</Text><Ionicons name="chevron-forward" size={19} color={colors.textSecondary} />
      </Pressable>
      {items.length === 0 && <Pressable accessibilityRole="button" onPress={props.onAdd} style={[s.cta, { backgroundColor: colors.accentMuted, borderColor: colors.accentMuted }]}>
        <Ionicons name="add-circle" size={33} color={colors.accent} />
        <View style={s.flex}><Text style={[s.ctaTitle, text]}>{c.register}</Text><Text style={[s.ctaDetail, secondary]}>{c.registerDetail}</Text></View>
        <Ionicons name="chevron-forward" size={19} color={colors.accent} />
      </Pressable>}
      <View>
        {all(c.seasonal, props.onAllSeasons)}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontal}>
          {seasons.map((season) => <Pressable key={season.id} accessibilityRole="button" onPress={() => props.onSeason(season.id)} style={({ pressed }) => [s.season, surface, { width: Math.max(150, (width - 18) / 2.15), opacity: pressed ? 0.7 : 1 }]}>
            <View style={[s.seasonIcon, { backgroundColor: `${season.accent}15` }]}><Ionicons name={season.icon} size={27} color={season.accent} /></View>
            <Text style={[s.seasonTitle, text]}>{c.seasons[season.id].title}</Text>
            <Text style={[s.seasonDetail, secondary]}>{c.seasons[season.id].detail}</Text>
          </Pressable>)}
        </ScrollView>
      </View>
      <Pressable accessibilityRole="button" onPress={props.onCategories} style={s.categories}>
        <Ionicons name="grid-outline" size={17} color={colors.textSecondary} /><Text style={[s.allText, secondary]}>{c.categories}</Text><Ionicons name="chevron-forward" size={15} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { gap: 12, paddingBottom: 16 }, flex: { flex: 1, minWidth: 0 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 40 },
  sectionTitle: { flex: 1, fontSize: 17, lineHeight: 24, fontWeight: '800' },
  all: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 2 }, allText: { fontSize: 12, fontWeight: '600' },
  horizontal: { gap: 9, paddingBottom: 2 },
  saved: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 8, paddingVertical: 12, alignItems: 'center', gap: 7, minHeight: 88 },
  savedIcon: { fontSize: 27 }, savedTitle: { fontSize: 12, lineHeight: 17, fontWeight: '700', textAlign: 'center' },
  savedNumber: { fontSize: 10, lineHeight: 14, textAlign: 'center', fontVariant: ['tabular-nums'] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', flexGrow: 1, borderWidth: 1, borderRadius: 19, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 9, paddingVertical: 15, minHeight: 111, gap: 4 },
  tileTitle: { fontSize: 15, lineHeight: 21, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  tileDetail: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  emergencyRow: { flexDirection: 'row', gap: 10 }, emergencyButton: { flex: 1, minHeight: 65, borderRadius: 17, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  phoneCircle: { width: 37, height: 37, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  emergencyNumber: { color: '#fff', fontSize: 24, lineHeight: 28, fontWeight: '800' }, emergencyLabel: { color: '#fff', fontSize: 12, lineHeight: 17, fontWeight: '600' },
  cta: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 17, paddingHorizontal: 12, paddingVertical: 12, minHeight: 60, gap: 10 },
  ctaIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  ctaTitle: { flexShrink: 1, flexGrow: 1, fontSize: 15, lineHeight: 21, fontWeight: '700' }, ctaDetail: { fontSize: 12, lineHeight: 18, marginTop: 3 },
  season: { borderWidth: 1, borderRadius: 18, padding: 13, gap: 5 },
  seasonIcon: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  seasonTitle: { fontSize: 14, lineHeight: 20, fontWeight: '700' }, seasonDetail: { fontSize: 12, lineHeight: 18 },
  categories: { flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
});
