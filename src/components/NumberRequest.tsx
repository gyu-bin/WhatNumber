import { useCallback, useEffect, useState } from 'react';
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
      setError('번호 이름, 전화번호, 설명 중 하나 이상 입력해 주세요.');
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
      setError(result.error);
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
          <span className={styles.triggerLabel}>빠진 번호 있나요?</span>
          <span className={styles.triggerSub}>추가 요청 보내기</span>
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
                번호 추가 요청
              </h2>
              <p className={styles.desc}>
                검토 후 반영할게요. 보내기를 누르면 바로 전달돼요.
              </p>
            </div>

            <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>번호 이름</span>
                </span>
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="예: 방첩신고, 전세사기 상담"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>전화번호</span>
                </span>
                <input
                  className={styles.input}
                  value={form.number}
                  onChange={(e) => update('number', e.target.value)}
                  placeholder="예: 113, 1588-0000"
                  inputMode="tel"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>설명 · 언제 쓰는지</span>
                </span>
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="어떤 상황에서 필요한 번호인지"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.labelRow}>
                  <span className={styles.label}>기타</span>
                  <span className={styles.optional}>선택</span>
                </span>
                <input
                  className={styles.input}
                  value={form.note}
                  onChange={(e) => update('note', e.target.value)}
                  placeholder="출처, 참고 링크 등"
                />
              </label>

              {error ? <p className={styles.error}>{error}</p> : null}
              {sent ? <p className={styles.error}>전송됐어요. 확인해 볼게요!</p> : null}

              <div className={styles.footer}>
                <button type="submit" className={styles.submit} disabled={sending || sent}>
                  {sending ? '보내는 중…' : '보내기'}
                </button>
                <button type="button" className={styles.cancel} onClick={close} disabled={sending}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
