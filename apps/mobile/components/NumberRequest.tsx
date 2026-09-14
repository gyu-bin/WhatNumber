import { useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  canSendFeedback,
  canSendNumberRequest,
  submitContactRequest,
  type NumberRequestForm,
} from '@whatnumber/shared';
import { NUMBER_REQUEST_API_URL } from '../constants';
import type { AppStyles } from '../styles';
import type { ThemeColors } from '../theme';

const EMPTY_FORM: NumberRequestForm = {
  title: '',
  number: '',
  description: '',
  note: '',
};

export type RequestModalMode = 'number' | 'feedback';

interface NumberRequestModalProps {
  visible: boolean;
  mode?: RequestModalMode;
  onClose: () => void;
  onSuccess?: (message: string) => void;
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

export function NumberRequestModal({
  visible,
  mode = 'number',
  onClose,
  onSuccess,
  styles,
  colors,
}: NumberRequestModalProps) {
  const [form, setForm] = useState<NumberRequestForm>(EMPTY_FORM);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const isFeedback = mode === 'feedback';

  useEffect(() => {
    if (!visible) return;
    setForm(EMPTY_FORM);
    setFeedbackMessage('');
    setError(null);
    setSending(false);
  }, [visible, mode]);

  const close = () => {
    onClose();
    setError(null);
    setSending(false);
  };

  const update = (key: keyof NumberRequestForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (sending) return;

    if (isFeedback) {
      if (!canSendFeedback({ message: feedbackMessage })) {
        setError('의견을 입력해 주세요.');
        return;
      }
    } else if (!canSendNumberRequest(form)) {
      setError('번호 이름, 전화번호, 설명 중 하나 이상 입력해 주세요.');
      return;
    }

    setSending(true);
    setError(null);

    const result = await submitContactRequest(
      NUMBER_REQUEST_API_URL,
      isFeedback
        ? { kind: 'feedback', message: feedbackMessage }
        : { kind: 'number-request', ...form },
    );

    setSending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const successMessage = isFeedback
      ? '의견을 보냈어요'
      : '번호 요청을 보냈어요';
    setForm(EMPTY_FORM);
    setFeedbackMessage('');
    onClose();
    onSuccess?.(successMessage);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.requestOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.requestBackdrop} onPress={close} />
        <View style={styles.requestSheet}>
          <View style={styles.handle} />
          <Text style={styles.requestTitle}>
            {isFeedback ? '의견 보내기' : '번호 추가 요청'}
          </Text>
          <Text style={styles.requestDesc}>
            {isFeedback
              ? '앱 사용 중 불편했던 점이나 개선 아이디어를 알려 주세요.'
              : '빠진 공공·생활 번호를 알려 주세요. 검토 후 반영할게요.'}
          </Text>

          <ScrollView
            style={styles.requestScroll}
            contentContainerStyle={styles.requestScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {isFeedback ? (
              <Field label="의견 내용" styles={styles}>
                <TextInput
                  style={[styles.requestInput, styles.requestTextarea]}
                  value={feedbackMessage}
                  onChangeText={(v) => {
                    setFeedbackMessage(v);
                    if (error) setError(null);
                  }}
                  placeholder="예: 검색이 잘 안 돼요, OO 카테고리가 있으면 좋겠어요"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                />
              </Field>
            ) : (
              <>
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
              </>
            )}

            {error ? <Text style={styles.requestError}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.requestFooter}>
            <Pressable
              style={({ pressed }) => [
                styles.requestSubmitBtn,
                (pressed || sending) && styles.requestSubmitBtnPressed,
              ]}
              onPress={() => void handleSubmit()}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.requestSubmitText}>
                  {isFeedback ? '의견 보내기' : '요청 보내기'}
                </Text>
              )}
            </Pressable>
            <Pressable style={styles.requestCancelLink} onPress={close} disabled={sending}>
              <Text style={styles.requestCancelText}>취소</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
