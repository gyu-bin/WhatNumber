import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NumberItem } from '@whatnumber/shared';
import type { ThemeColors } from '../theme';

const COPY = {
  ko: { add: '자주 쓰는 번호 등록', edit: '번호 수정', name: '이름', phone: '전화번호', example: '우리집, 병원, 회사', save: '저장', saving: '저장 중…', cancel: '취소', remove: '번호 삭제', confirm: '이 번호를 삭제할까요?', privacy: '직접 등록한 번호는 이 기기에 저장되며, 홈 화면 위젯에도 표시됩니다.', error: '저장하지 못했어요. 이름과 전화번호를 확인하고 다시 시도해주세요.', removeError: '삭제하지 못했어요. 다시 시도해주세요.', icon: '아이콘' },
  en: { add: 'Add frequent number', edit: 'Edit number', name: 'Name', phone: 'Phone number', example: 'Home, hospital, office', save: 'Save', saving: 'Saving…', cancel: 'Cancel', remove: 'Delete number', confirm: 'Delete this number?', privacy: 'Custom numbers are stored on this device and may appear in your home screen widget.', error: 'Could not save. Check the name and phone number and try again.', removeError: 'Could not delete. Please try again.', icon: 'Icon' },
  ja: { add: 'よく使う番号を登録', edit: '番号を編集', name: '名前', phone: '電話番号', example: '自宅、病院、会社', save: '保存', saving: '保存中…', cancel: 'キャンセル', remove: '番号を削除', confirm: 'この番号を削除しますか？', privacy: '登録した番号はこの端末に保存され、ホーム画面のウィジェットにも表示されます。', error: '保存できませんでした。名前と電話番号を確認してください。', removeError: '削除できませんでした。再試行してください。', icon: 'アイコン' },
  zh: { add: '添加常用号码', edit: '编辑号码', name: '名称', phone: '电话号码', example: '家、医院、公司', save: '保存', saving: '正在保存…', cancel: '取消', remove: '删除号码', confirm: '要删除此号码吗？', privacy: '自定义号码保存在此设备上，也会显示在主屏幕小组件中。', error: '无法保存。请检查名称和电话号码后重试。', removeError: '无法删除，请重试。', icon: '图标' },
};

export function SavedNumberEditor({ item, colors, onClose, onSave, onRemove }: {
  item?: NumberItem; colors: ThemeColors; onClose: () => void;
  onSave: (input: { title: string; num: string; icon: string }, id?: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const { i18n } = useTranslation();
  const c = COPY[(i18n.resolvedLanguage?.split('-')[0] ?? 'ko') as keyof typeof COPY] ?? COPY.ko;
  const [title, setTitle] = useState(item?.title ?? '');
  const [num, setNum] = useState(item?.num ?? '');
  const [icon, setIcon] = useState(item?.icon ?? '🏠');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const save = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try { await onSave({ title, num, icon }, item?.id); }
    catch { setError(c.error); setBusy(false); }
  };
  const remove = () => {
    if (!item || busy) return;
    Alert.alert(c.confirm, undefined, [
      { text: c.cancel, style: 'cancel' },
      { text: c.remove, style: 'destructive', onPress: async () => {
        setBusy(true);
        try { await onRemove(item.id); }
        catch { setError(c.removeError); setBusy(false); }
      } },
    ]);
  };
  return <Modal visible transparent animationType="slide" onRequestClose={() => { if (!busy) onClose(); }}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[s.overlay, { backgroundColor: colors.overlay }]}>
      <SafeAreaView edges={['bottom']} style={[s.sheet, { backgroundColor: colors.surface }]}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
          <View style={s.row}><Text accessibilityRole="header" style={[s.heading, { color: colors.textPrimary }]}>{item ? c.edit : c.add}</Text><Pressable disabled={busy} accessibilityRole="button" onPress={onClose} style={s.cancel}><Text style={{ color: colors.textSecondary }}>{c.cancel}</Text></Pressable></View>
          <Text style={[s.label, { color: colors.textSecondary }]}>{c.icon}</Text>
          <View style={s.icons}>{['🏠', '❤️', '💼', '👨‍👩‍👧', '🏥', '📞'].map((value) => <Pressable key={value} accessibilityRole="button" accessibilityLabel={`${c.icon} ${value}`} accessibilityState={{ selected: icon === value }} disabled={busy} onPress={() => setIcon(value)} style={[s.icon, { backgroundColor: icon === value ? colors.accentMuted : colors.tipBg, borderColor: icon === value ? colors.accent : 'transparent' }]}><Text style={{ fontSize: 23 }}>{value}</Text></Pressable>)}</View>
          <Text style={[s.label, { color: colors.textSecondary }]}>{c.name}</Text>
          <TextInput accessibilityLabel={c.name} placeholder={c.example} placeholderTextColor={colors.textTertiary} style={[s.input, { color: colors.textPrimary, backgroundColor: colors.tipBg }]} value={title} onChangeText={setTitle} maxLength={40} editable={!busy} autoCorrect={false} />
          <Text style={[s.label, { color: colors.textSecondary }]}>{c.phone}</Text>
          <TextInput accessibilityLabel={c.phone} keyboardType="phone-pad" placeholder="010-1234-5678" placeholderTextColor={colors.textTertiary} style={[s.input, { color: colors.textPrimary, backgroundColor: colors.tipBg }]} value={num} onChangeText={setNum} maxLength={30} editable={!busy} />
          <Text style={[s.note, { color: colors.textSecondary }]}>{c.privacy}</Text>
          {error ? <Text accessibilityRole="alert" style={[s.note, { color: colors.accent }]}>{error}</Text> : null}
          <Pressable accessibilityRole="button" disabled={busy || !title.trim() || !num.trim()} onPress={() => void save()} style={[s.save, { backgroundColor: colors.accent, opacity: busy || !title.trim() || !num.trim() ? 0.5 : 1 }]}><Text style={s.saveText}>{busy ? c.saving : c.save}</Text></Pressable>
          {item ? <Pressable disabled={busy} accessibilityRole="button" onPress={remove} style={s.cancel}><Text style={{ color: colors.accent }}>{c.remove}</Text></Pressable> : null}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  </Modal>;
}
const s = StyleSheet.create({ overlay: { flex: 1, justifyContent: 'flex-end' }, sheet: { maxHeight: '92%', borderTopLeftRadius: 24, borderTopRightRadius: 24 }, content: { padding: 22 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, heading: { fontSize: 21, fontWeight: '800', flex: 1 }, cancel: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }, label: { marginTop: 18, marginBottom: 8, fontSize: 14, fontWeight: '600' }, input: { minHeight: 52, padding: 14, borderRadius: 14, fontSize: 17 }, icons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1 }, note: { fontSize: 13, lineHeight: 20, marginTop: 16 }, save: { marginTop: 22, borderRadius: 16, padding: 15, minHeight: 50, alignItems: 'center' }, saveText: { color: '#fff', fontSize: 17, fontWeight: '700' } });
