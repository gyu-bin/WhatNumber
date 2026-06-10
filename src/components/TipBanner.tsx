import type { Situation } from '@whatnumber/shared';
import { SITUATION_TIPS } from '@whatnumber/shared';
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
