import type { ThemeColors } from '../../theme';
import { GuideButton, GuideSheet } from './GuideSheet';
import { useGuideCopy } from './copy';
export function WidgetIntroSheet({ colors, onClose, onContinue }: { colors: ThemeColors; onClose: () => void; onContinue: () => void }) {
  const c = useGuideCopy();
  return <GuideSheet colors={colors} onClose={onClose} icon="star" title={c.saved} body={c.savedBody} actions={<><GuideButton colors={colors} label={c.widgetHowTo} onPress={onContinue} /><GuideButton secondary colors={colors} label={c.later} onPress={onClose} /></>} />;
}
