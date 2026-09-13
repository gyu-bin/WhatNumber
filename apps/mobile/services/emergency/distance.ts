import type { Coordinate } from './types';

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** 두 좌표 사이의 직선거리(km)를 Haversine 공식으로 계산합니다. */
export function distanceInKm(from: Coordinate, to: Coordinate): number {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) return `${Math.max(1, Math.round(distanceKm * 1000))}m`;
  return `${distanceKm.toFixed(1)}km`;
}
