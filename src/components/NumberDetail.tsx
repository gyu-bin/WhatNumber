import {
  CAT_COLOR,
  iconBgColor,
  telHref,
} from '@whatnumber/shared';
import type { NumberItem } from '@whatnumber/shared';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { copyNumberShare, copyText } from '../utils/share';
import { localizeNumberDetail } from '../i18n';
import { useLocale } from '../hooks/useLocale';
import { numberPath } from '../utils/seo';
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
  const { t } = useTranslation();
  const { locale } = useLocale();

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
    onCopied(ok ? t('detail.copyLinkOk') : t('common.copyFail'));
  };

  const handleCopyNumber = async () => {
    const ok = await copyText(item.num);
    onCopied(ok ? t('detail.copyNumberOk') : t('common.copyFail'));
  };

  const detail = localizeNumberDetail(item.id, locale) ?? [];

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
          aria-label={t('detail.closeA11y')}
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
              {t(`categories.${item.cat}`)}
            </span>
            <h2 id="detail-title" className={styles.title}>
              {item.title}
            </h2>
          </div>
        </div>

        <p className={styles.desc}>{item.desc}</p>

        {detail.length > 0 && (
          <div className={styles.article}>
            {detail.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        )}

        {item.tip && (
          <div className={styles.tip} role="note">
            {t('detail.tipPrefix')} {item.tip}
          </div>
        )}

        {item.situation.length > 0 && (
          <div className={styles.tags}>
            {item.situation.map((s) => (
              <span key={s} className={styles.tag}>
                {t(`situationLabels.${s}`)}
              </span>
            ))}
          </div>
        )}

        <a href={telHref(item.num)} className={styles.callBtn}>
          {t('detail.call', { num: item.num })}
        </a>

        <Link to={numberPath(item.id)} className={styles.permalink}>
          {t('detail.permalink')}
        </Link>

        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} onClick={handleShare}>
            {t('detail.copyLink')}
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleCopyNumber}
          >
            {t('detail.copyNumber')}
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.favBtn}`}
            data-active={isFavorite || undefined}
            onClick={() => onToggleFavorite(item.id)}
          >
            {isFavorite ? t('favorites.removeStar') : t('favorites.addStar')}
          </button>
        </div>
      </div>
    </div>
  );
}
