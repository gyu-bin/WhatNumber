import { useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  buildNumberRequestMailUrl,
  canSendNumberRequest,
  type NumberRequestForm,
} from '@whatnumber/shared';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

const EMPTY_FORM: NumberRequestForm = {
  title: '',
  number: '',
  description: '',
  note: '',
};

interface NumberRequestProps {
  styles: AppStyles;
  colors: ThemeColors;
}

function Field({
  label,
  optional,
  children,
  styles,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
  styles: AppStyles;
}) {
  return (
    <View style={styles.requestField}>
      <View style={styles.requestLabelRow}>
        <Text style={styles.requestLabel}>{label}</Text>
        {optional ? <Text style={styles.requestOptional}>선택</Text> : null}
      </View>
      {children}
    </View>
  );
}

export function NumberRequest({ styles, colors }: NumberRequestProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NumberRequestForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setError(null);
  };

  const update = (key: keyof NumberRequestForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!canSendNumberRequest(form)) {
      setError('번호 이름, 전화번호, 설명 중 하나 이상 입력해 주세요.');
      return;
    }

    const url = buildNumberRequestMailUrl(form);
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      setError('메일 앱을 열 수 없어요. 메일 앱 설정을 확인해 주세요.');
      return;
    }

    await Linking.openURL(url);
    setForm(EMPTY_FORM);
    close();
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.requestTrigger, pressed && styles.requestTriggerPressed]}
        onPress={() => setOpen(true)}
      >
        <View style={styles.requestTriggerIcon}>
          <Text style={styles.requestTriggerIconText}>+</Text>
        </View>
        <View style={styles.requestTriggerBody}>
          <Text style={styles.requestTriggerLabel}>빠진 번호 있나요?</Text>
          <Text style={styles.requestTriggerSub}>추가 요청 보내기</Text>
        </View>
        <Text style={styles.requestTriggerChevron}>›</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
        <KeyboardAvoidingView
          style={styles.requestOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.requestBackdrop} onPress={close} />
          <View style={styles.requestSheet}>
            <View style={styles.handle} />
            <Text style={styles.requestTitle}>번호 추가 요청</Text>
            <Text style={styles.requestDesc}>
              검토 후 반영할게요. 메일 앱에서 보내기만 누르면 됩니다.
            </Text>

            <ScrollView
              style={styles.requestScroll}
              contentContainerStyle={styles.requestScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Field label="번호 이름" styles={styles}>
                <TextInput
                  style={styles.requestInput}
                  value={form.title}
                  onChangeText={(v) => update('title', v)}
                  placeholder="예: 방첩신고, 전세사기 상담"
                  placeholderTextColor={colors.textTertiary}
                />
              </Field>

              <Field label="전화번호" styles={styles}>
                <TextInput
                  style={styles.requestInput}
                  value={form.number}
                  onChangeText={(v) => update('number', v)}
                  placeholder="예: 113, 1588-0000"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="phone-pad"
                />
              </Field>

              <Field label="설명 · 언제 쓰는지" styles={styles}>
                <TextInput
                  style={[styles.requestInput, styles.requestTextarea]}
                  value={form.description}
                  onChangeText={(v) => update('description', v)}
                  placeholder="어떤 상황에서 필요한 번호인지"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  textAlignVertical="top"
                />
              </Field>

              <Field label="기타" optional styles={styles}>
                <TextInput
                  style={styles.requestInput}
                  value={form.note}
                  onChangeText={(v) => update('note', v)}
                  placeholder="출처, 참고 링크 등"
                  placeholderTextColor={colors.textTertiary}
                />
              </Field>

              {error ? <Text style={styles.requestError}>{error}</Text> : null}
            </ScrollView>

            <View style={styles.requestFooter}>
              <Pressable
                style={({ pressed }) => [
                  styles.requestSubmitBtn,
                  pressed && styles.requestSubmitBtnPressed,
                ]}
                onPress={() => void handleSubmit()}
              >
                <Text style={styles.requestSubmitText}>메일 보내기</Text>
              </Pressable>
              <Pressable style={styles.requestCancelLink} onPress={close}>
                <Text style={styles.requestCancelText}>취소</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
