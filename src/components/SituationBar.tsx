import type { CSSProperties } from 'react';
import type { Situation } from '../data/numbers';
import { SITUATION_ACCENT } from '../data/numbers';
import { TipBanner } from './TipBanner';
import styles from './SituationBar.module.css';

const SITUATIONS: { id: Situation; icon: string; label: string }[] = [
  { id: 'emergency', icon: '🚑', label: '갑자기 아파요' },
  { id: 'car', icon: '🚗', label: '차가 고장났어요' },
  { id: 'crime', icon: '🚨', label: '사기·범죄 피해' },
  { id: 'home', icon: '🏠', label: '집 관련 문제' },
  { id: 'abroad', icon: '✈️', label: '해외에 있어요' },
  { id: 'legal', icon: '⚖️', label: '법률·금융 문제' },
];

interface SituationBarProps {
  active: Situation | null;
  onSelect: (id: Situation | null) => void;
  disabled?: boolean;
}

export function SituationBar({ active, onSelect, disabled }: SituationBarProps) {
  const handleClick = (id: Situation) => {
    if (disabled) return;
    onSelect(active === id ? null : id);
  };

  return (
    <section className={`${styles.bar} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.inner}>
        <p className={styles.label}>지금 어떤 상황이에요?</p>
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
                <span className={styles.btnLabel}>{s.label}</span>
              </button>
            );
          })}
        </div>
        {active && <TipBanner situation={active} />}
      </div>
    </section>
  );
}
