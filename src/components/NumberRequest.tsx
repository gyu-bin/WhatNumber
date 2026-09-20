import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  canSendNumberRequest,
  submitContactRequest,
  type NumberRequestForm,
} from '@whatnumber/shared';
import styles from './NumberRequest.module.css';

const EMPTY_FORM: NumberRequestForm = {
  title: '',
  number: '',
  description: '',
  note: '',
};

const NUMBER_REQUEST_API_URL =
  import.meta.env.VITE_NUMBER_REQUEST_API_URL?.trim() || '/api/number-request';

export function NumberRequest() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NumberRequestForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setSending(false);
    setSent(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const update = (key: keyof NumberRequestForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (!canSendNumberRequest(form)) {
      setError(t('request.errorEmpty'));
      return;
    }

    setSending(true);
    setError(null);

    const result = await submitContactRequest(NUMBER_REQUEST_API_URL, {
      kind: 'number-request',
      ...form,
    });

    setSending(false);

    if (!result.ok) {
      setError(
        result.error === 'network'
          ? t('request.errorNetwork')
          : t('request.errorSend'),
      );
      return;
    }

    setSent(true);
    setForm(EMPTY_FORM);
    window.setTimeout(() => close(), 900);
  };

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        <span className={styles.triggerIcon} aria-hidden>
          +
        </span>
        <span className={styles.triggerBody}>
          <span className={styles.triggerLabel}>{t('request.triggerLabel')}</span>
          <span className={styles.triggerSub}>{t('request.triggerSub')}</span>
        </span>
        <span className={styles.triggerChevron} aria-hidden>
          ›
        </span>
      </button>

      {open ? (
        <div className={styles.overlay} onClick={close} role="presentation">
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.handle} aria-hidden />
            <div className={styles.header}>
              <h2 id="request-title" className={styles.title}>
                {t('request.title')}
              </h2>
              <p className={styles.desc}>{t('request.desc')}</p>
            </div>

            <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>{t('request.nameLabel')}</span>
                </span>
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder={t('request.namePlaceholder')}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>{t('request.phoneLabel')}</span>
                </span>
                <input
                  className={styles.input}
                  value={form.number}
                  onChange={(e) => update('number', e.target.value)}
                  placeholder={t('request.phonePlaceholder')}
                  inputMode="tel"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>{t('request.descriptionLabel')}</span>
                </span>
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder={t('request.descriptionPlaceholder')}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>{t('request.noteLabel')}</span>
                  <span className={styles.optional}>{t('request.optional')}</span>
                </span>
                <input
                  className={styles.input}
                  value={form.note}
                  onChange={(e) => update('note', e.target.value)}
                  placeholder={t('request.notePlaceholder')}
                />
              </label>

              {error ? <p className={styles.error}>{error}</p> : null}
              {sent ? <p className={styles.error}>{t('request.success')}</p> : null}

              <div className={styles.footer}>
                <button type="submit" className={styles.submit} disabled={sending || sent}>
                  {sending ? t('request.sending') : t('request.send')}
                </button>
                <button type="button" className={styles.cancel} onClick={close} disabled={sending}>
                  {t('request.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
