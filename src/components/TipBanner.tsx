import type { Situation } from '../data/numbers';
import { SITUATION_TIPS } from '../data/numbers';
import styles from './TipBanner.module.css';

interface TipBannerProps {
  situation: Situation;
}

export function TipBanner({ situation }: TipBannerProps) {
  const tip = SITUATION_TIPS[situation];
  if (!tip) return null;

  return (
    <div className={styles.banner} role="note">
      {tip}
    </div>
  );
}
