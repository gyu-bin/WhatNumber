import { Alert, Linking } from 'react-native';
import i18n from '../i18n';
import type { Coordinate } from './emergency/types';

function tMaps(key: string): string {
  return i18n.t(key, { ns: 'ui' });
}

const APP_SCHEME_ID = 'kr.whatnumber.app';

type OpenDirectionsOptions = {
  destination: Coordinate;
  /** Shown as the route destination label in map apps. */
  destinationName?: string;
  /** Current user location — already requested on the emergency finder screen. */
  origin?: Coordinate | null;
  originName?: string;
  /** Label when destinationName is empty (e.g. localized “Emergency room”). */
  destinationFallback?: string;
};

async function tryOpenUrl(url: string): Promise<boolean> {
  try {
    // Attempt launch directly: Android package visibility can make canOpenURL
    // return false even when NAVER Map is installed in an existing app binary.
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

function resolveDestinationLabel(options: OpenDirectionsOptions): string {
  return (
    options.destinationName?.trim() ||
    options.destinationFallback?.trim() ||
    tMaps('maps.emergencyRoom')
  );
}

function buildNaverDirectionsUrl(options: OpenDirectionsOptions): string {
  const { destination, origin, originName } = options;
  const parts = [
    `dlat=${destination.latitude}`,
    `dlng=${destination.longitude}`,
    `dname=${encodeURIComponent(resolveDestinationLabel(options))}`,
    `appname=${APP_SCHEME_ID}`,
  ];
  if (origin) {
    parts.unshift(
      `slat=${origin.latitude}`,
      `slng=${origin.longitude}`,
      `sname=${encodeURIComponent(originName?.trim() || tMaps('maps.currentLocation'))}`,
    );
  }
  return `nmap://route/car?${parts.join('&')}`;
}

/** Open only NAVER Map using its documented route/car scheme. */
export async function openDirections(
  destination: Coordinate,
  options?: Omit<OpenDirectionsOptions, 'destination'>,
): Promise<void> {
  const payload: OpenDirectionsOptions = {
    destination,
    destinationName: options?.destinationName,
    origin: options?.origin ?? null,
    originName: options?.originName,
    destinationFallback: options?.destinationFallback,
  };

  if (await tryOpenUrl(buildNaverDirectionsUrl(payload))) return;
  Alert.alert(tMaps('maps.naverRequiredTitle'), tMaps('maps.naverRequiredBody'));
}
