import { useEffect } from 'react';
import type { NumberItem } from '../data/numbers';
import {
  CAT_COLOR,
  SITUATION_LABELS,
  iconBgColor,
  telHref,
} from '../data/numbers';
import { copyNumberShare, copyText } from '../utils/share';
import styles from './NumberDetail.module.css';

interface NumberDetailProps {
  item: NumberItem;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onCopied: (message: string) => void;
}

export function NumberDetail({
  item,
  isFavorite,
  onClose,
  onToggleFavorite,
  onCopied,
}: NumberDetailProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleShare = async () => {
    const ok = await copyNumberShare(item);
    onCopied(ok ? '상세 정보 링크가 복사됐어요' : '복사에 실패했어요');
  };

  const handleCopyNumber = async () => {
    const ok = await copyText(item.num);
    onCopied(ok ? '전화번호가 복사됐어요' : '복사에 실패했어요');
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} aria-hidden />
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>

        <div className={styles.head}>
          <div
            className={styles.iconWrap}
            style={{ background: iconBgColor(item.cat) }}
            aria-hidden
          >
            <span>{item.icon}</span>
          </div>
          <div className={styles.headText}>
            <span
              className={styles.cat}
              style={{ color: CAT_COLOR[item.cat] }}
            >
              {item.cat}
            </span>
            <h2 id="detail-title" className={styles.title}>
              {item.title}
            </h2>
          </div>
        </div>

        <p className={styles.desc}>{item.desc}</p>

        {item.tip && (
          <div className={styles.tip} role="note">
            💡 {item.tip}
          </div>
        )}

        {item.situation.length > 0 && (
          <div className={styles.tags}>
            {item.situation.map((s) => (
              <span key={s} className={styles.tag}>
                {SITUATION_LABELS[s]}
              </span>
            ))}
          </div>
        )}

        <a href={telHref(item.num)} className={styles.callBtn}>
          {item.num} 전화하기
        </a>

        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} onClick={handleShare}>
            링크 복사
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleCopyNumber}
          >
            번호만 복사
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.favBtn}`}
            data-active={isFavorite || undefined}
            onClick={() => onToggleFavorite(item.id)}
          >
            {isFavorite ? '★ 즐겨찾기' : '☆ 즐겨찾기'}
          </button>
        </div>
      </div>
    </div>
  );
}
