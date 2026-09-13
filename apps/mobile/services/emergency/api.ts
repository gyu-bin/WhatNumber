import type { Coordinate, EmergencyRoom, EmergencyRoomsResponse } from './types';

export class EmergencyRoomsConfigurationError extends Error {}

export class EmergencyRoomsResponseError extends Error {}

function getEndpoint(): string {
  const endpoint = process.env.EXPO_PUBLIC_EMERGENCY_API_BASE_URL?.trim();
  if (!endpoint) {
    throw new EmergencyRoomsConfigurationError('응급실 정보 연결이 아직 설정되지 않았어요.');
  }
  return endpoint;
}

function parseResponse(value: unknown): EmergencyRoomsResponse {
  if (!value || typeof value !== 'object' || !Array.isArray((value as EmergencyRoomsResponse).rooms)) {
    throw new EmergencyRoomsResponseError('응급실 정보 형식을 확인할 수 없어요.');
  }

  return value as EmergencyRoomsResponse;
}

/**
 * API 키는 서버 프록시에만 보관합니다. 앱은 현재 좌표와 화면용 최소 데이터를 주고받습니다.
 */
export async function fetchNearbyEmergencyRooms(
  currentLocation: Coordinate,
  signal?: AbortSignal,
): Promise<{ rooms: EmergencyRoom[]; fetchedAt?: string }> {
  const endpoint = getEndpoint();
  const url = new URL(endpoint);
  url.searchParams.set('latitude', String(currentLocation.latitude));
  url.searchParams.set('longitude', String(currentLocation.longitude));

  const response = await fetch(url.toString(), {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`응급실 정보를 불러오지 못했어요. (${response.status})`);
  }

  const payload = parseResponse(await response.json());
  const rooms = payload.rooms
    .filter(
      (room) =>
        room &&
        typeof room.id === 'string' &&
        typeof room.name === 'string' &&
        typeof room.address === 'string' &&
        Number.isFinite(room.location?.latitude) &&
        Number.isFinite(room.location?.longitude) &&
        Number.isFinite(room.distanceKm),
    )
    .map((room) => ({ ...room }));

  return { rooms, fetchedAt: payload.fetchedAt };
}
