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
import { useTranslation } from 'react-i18next';
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
  optionalLabel,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
  styles: AppStyles;
  optionalLabel: string;
}) {
  return (
    <View style={styles.requestField}>
      <View style={styles.requestLabelRow}>
        <Text style={styles.requestLabel}>{label}</Text>
        {optional ? <Text style={styles.requestOptional}>{optionalLabel}</Text> : null}
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
  const { t } = useTranslation();
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
        setError(t('request.errorFeedbackEmpty'));
        return;
      }
    } else if (!canSendNumberRequest(form)) {
      setError(t('request.errorEmpty'));
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
      setError(t(`request.error.${result.error}`));
      return;
    }

    const successMessage = isFeedback
      ? t('request.successFeedback')
      : t('request.successNumber');
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
            {isFeedback ? t('request.feedbackTitle') : t('request.numberTitle')}
          </Text>
          <Text style={styles.requestDesc}>
            {isFeedback ? t('request.feedbackDesc') : t('request.numberDesc')}
          </Text>

          <ScrollView
            style={styles.requestScroll}
            contentContainerStyle={styles.requestScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {isFeedback ? (
              <Field label={t('request.feedbackContent')} styles={styles} optionalLabel={t('request.optional')}>
                <TextInput
                  style={[styles.requestInput, styles.requestTextarea]}
                  value={feedbackMessage}
                  onChangeText={(v) => {
                    setFeedbackMessage(v);
                    if (error) setError(null);
                  }}
                  placeholder={t('request.feedbackPlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                />
              </Field>
            ) : (
              <>
                <Field label={t('request.numberName')} styles={styles} optionalLabel={t('request.optional')}>
                  <TextInput
                    style={styles.requestInput}
                    value={form.title}
                    onChangeText={(v) => update('title', v)}
                    placeholder={t('request.namePlaceholder')}
                    placeholderTextColor={colors.textTertiary}
                  />
                </Field>

                <Field label={t('request.phone')} styles={styles} optionalLabel={t('request.optional')}>
                  <TextInput
                    style={styles.requestInput}
                    value={form.number}
                    onChangeText={(v) => update('number', v)}
                    placeholder={t('request.phonePlaceholder')}
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="phone-pad"
                  />
                </Field>

                <Field label={t('request.descriptionWhen')} styles={styles} optionalLabel={t('request.optional')}>
                  <TextInput
                    style={[styles.requestInput, styles.requestTextarea]}
                    value={form.description}
                    onChangeText={(v) => update('description', v)}
                    placeholder={t('request.descriptionPlaceholder')}
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    textAlignVertical="top"
                  />
                </Field>

                <Field label={t('request.note')} optional styles={styles} optionalLabel={t('request.optional')}>
                  <TextInput
                    style={styles.requestInput}
                    value={form.note}
                    onChangeText={(v) => update('note', v)}
                    placeholder={t('request.notePlaceholder')}
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
                  {isFeedback ? t('request.feedbackTitle') : t('request.sendRequest')}
                </Text>
              )}
            </Pressable>
            <Pressable style={styles.requestCancelLink} onPress={close} disabled={sending}>
              <Text style={styles.requestCancelText}>{t('request.cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
