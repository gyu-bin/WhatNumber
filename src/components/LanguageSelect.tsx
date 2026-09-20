import { APP_LOCALES, LOCALE_LABELS, type AppLocale } from '../i18n';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelect.module.css';

interface LanguageSelectProps {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
}

export function LanguageSelect({ locale, onChange }: LanguageSelectProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <label className="sr-only" htmlFor="app-locale">
        {t('common.language')}
      </label>
      <select
        id="app-locale"
        className={styles.select}
        value={locale}
        onChange={(e) => void onChange(e.target.value as AppLocale)}
        aria-label={t('common.language')}
      >
        {APP_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
      <span className={styles.chevron} aria-hidden>
        ▾
      </span>
    </div>
  );
}
