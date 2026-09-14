import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type Ref,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Coordinate, EmergencyRoom } from '../services/emergency/types';
import type { ThemeColors } from '../theme';

/** Zoomed out enough to show nearby hospitals (~4–6km) with the user. */
const DEFAULT_ZOOM = 11;
const MARKER_SIZE = 36;
const MARKER_SELECTED_SIZE = 44;

export type EmergencyMapHandle = {
  /** 이미 알고 있는 좌표로 카메라만 이동 (권한/API 재요청 없음) */
  focusCoordinate: (coordinate: Coordinate, zoom?: number) => void;
};

type EmergencyMapProps = {
  colors: ThemeColors;
  height: number;
  userLocation: Coordinate | null;
  rooms: EmergencyRoom[];
  selectedId: string | null;
  onSelectRoom: (id: string) => void;
};

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export const EmergencyMap = forwardRef<EmergencyMapHandle, EmergencyMapProps>(
  function EmergencyMap(props, ref) {
    if (isExpoGo()) {
      return (
        <View
          style={[
            styles.fallback,
            { height: props.height, backgroundColor: props.colors.heroBg },
          ]}
        >
          <Ionicons name="map-outline" size={28} color={props.colors.accent} />
          <Text style={[styles.fallbackTitle, { color: props.colors.textPrimary }]}>
            지도 미리보기
          </Text>
          <Text style={[styles.fallbackBody, { color: props.colors.textSecondary }]}>
            네이버 지도는 개발/배포 빌드에서 표시됩니다. Expo Go에서는 목록만 사용할 수
            있어요.
          </Text>
        </View>
      );
    }

    return <EmergencyMapNative {...props} forwardedRef={ref} />;
  },
);

function EmergencyMapNative({
  colors,
  height,
  userLocation,
  rooms,
  selectedId,
  onSelectRoom,
  forwardedRef,
}: EmergencyMapProps & {
  forwardedRef: Ref<EmergencyMapHandle>;
}) {
  // Expo Go 경로를 피한 뒤에만 네이티브 모듈을 로드합니다.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const maps =
    require('@mj-studio/react-native-naver-map') as typeof import('@mj-studio/react-native-naver-map');
  const { NaverMapView, NaverMapMarkerOverlay } = maps;
  type MapViewRef = import('@mj-studio/react-native-naver-map').NaverMapViewRef;

  const nativeRef = useRef<MapViewRef>(null);

  useImperativeHandle(forwardedRef, () => ({
    focusCoordinate: (coordinate, zoom = DEFAULT_ZOOM) => {
      nativeRef.current?.animateCameraTo({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        zoom,
        duration: 320,
        easing: 'EaseOut',
      });
    },
  }));

  const fitToRooms = () => {
    if (!userLocation || rooms.length === 0) return;
    const farthest = rooms.reduce((best, room) =>
      room.distanceKm > best.distanceKm ? room : best,
    );
    nativeRef.current?.animateCameraWithTwoCoords({
      coord1: userLocation,
      coord2: farthest.location,
      duration: 360,
      easing: 'EaseOut',
    });
  };

  // Rooms arrive after the map mounts — zoom out so hospital pins are on screen.
  useEffect(() => {
    if (!userLocation || rooms.length === 0) return;
    const timer = setTimeout(fitToRooms, 80);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fit once per room set / location
  }, [userLocation?.latitude, userLocation?.longitude, rooms]);

  const initialCamera = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        zoom: DEFAULT_ZOOM,
      }
    : rooms[0]
      ? {
          latitude: rooms[0].location.latitude,
          longitude: rooms[0].location.longitude,
          zoom: DEFAULT_ZOOM,
        }
      : { latitude: 37.5665, longitude: 126.978, zoom: DEFAULT_ZOOM };

  const recenter = () => {
    if (userLocation && rooms.length > 0) {
      fitToRooms();
      return;
    }
    if (!userLocation) return;
    nativeRef.current?.animateCameraTo({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      zoom: DEFAULT_ZOOM,
      duration: 300,
      easing: 'EaseOut',
    });
  };

  return (
    <View style={[styles.mapWrap, { height }]}>
      <NaverMapView
        ref={nativeRef}
        style={StyleSheet.absoluteFill}
        mapType="Basic"
        locale="ko"
        isExtentBoundedInKorea
        isShowZoomControls={false}
        isShowLocationButton={false}
        isShowCompass={false}
        isShowScaleBar={false}
        initialCamera={initialCamera}
        locationOverlay={
          userLocation
            ? {
                isVisible: true,
                position: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                },
                circleRadius: 40,
                circleColor: 'rgba(64, 140, 255, 0.22)',
              }
            : undefined
        }
      >
        {rooms.map((room) => {
          const selected = room.id === selectedId;
          const size = selected ? MARKER_SELECTED_SIZE : MARKER_SIZE;
          return (
            <NaverMapMarkerOverlay
              key={room.id}
              latitude={room.location.latitude}
              longitude={room.location.longitude}
              width={size}
              height={size}
              anchor={{ x: 0.5, y: 1 }}
              zIndex={selected ? 20 : 1}
              image={{ symbol: selected ? 'red' : 'pink' }}
              onTap={() => onSelectRoom(room.id)}
              caption={{
                text: room.name,
                color: colors.textPrimary,
                haloColor: colors.surface,
                textSize: 11,
                offset: 2,
              }}
            />
          );
        })}
      </NaverMapView>

      {userLocation ? (
        <Pressable
          style={[
            styles.locateButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={recenter}
          accessibilityRole="button"
          accessibilityLabel="현재 위치로 이동"
        >
          <Ionicons name="locate" size={20} color={colors.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    overflow: 'hidden',
  },
  locateButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  fallbackTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  fallbackBody: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
