import { useCallback, useEffect, useState } from 'react';
import {
  buildNumberRequestMailUrl,
  canSendNumberRequest,
  type NumberRequestForm,
} from '@whatnumber/shared';
import styles from './NumberRequest.module.css';

const EMPTY_FORM: NumberRequestForm = {
  title: '',
  number: '',
  description: '',
  note: '',
};

export function NumberRequest() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NumberRequestForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSendNumberRequest(form)) {
      setError('번호 이름, 전화번호, 설명 중 하나 이상 입력해 주세요.');
      return;
    }
    window.location.href = buildNumberRequestMailUrl(form);
    setForm(EMPTY_FORM);
    close();
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
                검토 후 반영할게요. 메일 앱에서 보내기만 누르면 됩니다.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
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

              <div className={styles.footer}>
                <button type="submit" className={styles.submit}>
                  메일 보내기
                </button>
                <button type="button" className={styles.cancel} onClick={close}>
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
