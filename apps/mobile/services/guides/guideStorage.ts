import AsyncStorage from '@react-native-async-storage/async-storage';

export const GUIDE_KEYS = {
  onboarding: 'whatnumber_onboarding_completed_v1',
  widget: 'whatnumber_widget_guide_shown_v1',
  emergency: 'whatnumber_emergency_guide_shown_v1',
} as const;

export type GuideFlags = Record<keyof typeof GUIDE_KEYS, boolean>;

export async function loadGuideFlags(): Promise<GuideFlags> {
  const entries = new Map(await AsyncStorage.multiGet(Object.values(GUIDE_KEYS)));
  return {
    onboarding: entries.get(GUIDE_KEYS.onboarding) === 'true',
    widget: entries.get(GUIDE_KEYS.widget) === 'true',
    emergency: entries.get(GUIDE_KEYS.emergency) === 'true',
  };
}

export function markGuideDone(guide: keyof GuideFlags): Promise<void> {
  return AsyncStorage.setItem(GUIDE_KEYS[guide], 'true');
}
