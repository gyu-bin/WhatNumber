import { Linking } from 'react-native';
import type { Coordinate } from './emergency/types';

/** 별도 지도 SDK 없이 설치된 지도 앱 또는 브라우저에서 길찾기를 엽니다. */
export function openDirections(destination: Coordinate): Promise<unknown> {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', `${destination.latitude},${destination.longitude}`);
  return Linking.openURL(url.toString());
}
