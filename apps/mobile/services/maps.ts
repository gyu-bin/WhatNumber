import { Linking } from 'react-native';
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
    const supported = await Linking.canOpenURL(url);
    if (!supported) return false;
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

function buildKakaoDirectionsUrl({
  destination,
  origin,
}: OpenDirectionsOptions): string {
  if (origin) {
    return (
      `kakaomap://route?sp=${origin.latitude},${origin.longitude}` +
      `&ep=${destination.latitude},${destination.longitude}&by=CAR`
    );
  }
  return `kakaomap://look?p=${destination.latitude},${destination.longitude}`;
}

function buildKakaoWebDirectionsUrl(options: OpenDirectionsOptions): string {
  const { destination, origin, originName } = options;
  const dname = encodeURIComponent(resolveDestinationLabel(options));
  if (origin) {
    const sname = encodeURIComponent(originName?.trim() || tMaps('maps.currentLocation'));
    return (
      `https://map.kakao.com/link/from/${sname},${origin.latitude},${origin.longitude}` +
      `/to/${dname},${destination.latitude},${destination.longitude}`
    );
  }
  return `https://map.kakao.com/link/to/${dname},${destination.latitude},${destination.longitude}`;
}

/**
 * Opens turn-by-turn directions: Naver Map app → Kakao Map app → Kakao Map web.
 * Uses the already-fetched user location as the route start when available.
 */
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
  if (await tryOpenUrl(buildKakaoDirectionsUrl(payload))) return;

  await Linking.openURL(buildKakaoWebDirectionsUrl(payload));
}
