import type { CSSProperties } from 'react';
import type { Situation } from '@whatnumber/shared';
import { SITUATION_ACCENT } from '@whatnumber/shared';
import { useTranslation } from 'react-i18next';
import { TipBanner } from './TipBanner';
import styles from './SituationBar.module.css';

const SITUATIONS: { id: Situation; icon: string; labelKey: string }[] = [
  { id: 'emergency', icon: '🚑', labelKey: 'situations.emergency' },
  { id: 'car', icon: '🚗', labelKey: 'situations.car' },
  { id: 'crime', icon: '🚨', labelKey: 'situationLabels.crime' },
  { id: 'home', icon: '🏠', labelKey: 'situationLabels.home' },
  { id: 'abroad', icon: '✈️', labelKey: 'situations.abroad' },
  { id: 'legal', icon: '⚖️', labelKey: 'situations.legal' },
];

interface SituationBarProps {
  active: Situation | null;
  onSelect: (id: Situation | null) => void;
  disabled?: boolean;
}

export function SituationBar({ active, onSelect, disabled }: SituationBarProps) {
  const { t } = useTranslation();

  const handleClick = (id: Situation) => {
    if (disabled) return;
    onSelect(active === id ? null : id);
  };

  return (
    <section className={`${styles.bar} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.inner}>
        <p className={styles.label}>{t('situationBar.label')}</p>
        <div className={styles.grid}>
          {SITUATIONS.map((s) => {
            const isActive = active === s.id;
            const accent = SITUATION_ACCENT[s.id];
            return (
              <button
                key={s.id}
                type="button"
                className={styles.btn}
                data-active={isActive || undefined}
                style={
                  isActive
                    ? ({
                        '--situation-accent': accent,
                      } as CSSProperties)
                    : undefined
                }
                onClick={() => handleClick(s.id)}
                disabled={disabled}
              >
                <span className={styles.btnIcon}>{s.icon}</span>
                <span className={styles.btnLabel}>{t(s.labelKey)}</span>
              </button>
            );
          })}
        </div>
        {active && <TipBanner situation={active} />}
      </div>
    </section>
  );
}
