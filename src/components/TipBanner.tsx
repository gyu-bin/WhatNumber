import type { Situation } from '@whatnumber/shared';
import { useTranslation } from 'react-i18next';
import styles from './TipBanner.module.css';

interface TipBannerProps {
  situation: Situation;
}

export function TipBanner({ situation }: TipBannerProps) {
  const { t } = useTranslation();
  const tip = t(`situationTips.${situation}`);
  if (!tip || tip === `situationTips.${situation}`) return null;

  return (
    <div className={styles.banner} role="note">
      {tip}
    </div>
  );
}
