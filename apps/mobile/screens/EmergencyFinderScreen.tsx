import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { telHref } from '@whatnumber/shared';
import {
  EmergencyMap,
  type EmergencyMapHandle,
} from '../components/EmergencyMap';
import {
  EmergencyRoomsConfigurationError,
  fetchNearbyEmergencyRooms,
} from '../services/emergency/api';
import { formatDistance } from '../services/emergency/distance';
import type { Coordinate, EmergencyRoom } from '../services/emergency/types';
import { openDirections } from '../services/maps';
import type { ThemeColors } from '../theme';

/** iOS/Android 시뮬레이터 테스트용: 강남역 */
const SIMULATOR_LOCATION: Coordinate = {
  latitude: 37.4979,
  longitude: 127.0276,
};

const MAP_HEIGHT = Math.round(Dimensions.get('window').height * 0.3);

type FinderState =
  | 'idle'
  | 'locating'
  | 'loading'
  | 'ready'
  | 'permission-denied'
  | 'location-disabled'
  | 'offline'
  | 'configuration-error'
  | 'api-error'
  | 'empty';

type RoomSort = 'distance' | 'beds';

function sortRooms(rooms: EmergencyRoom[], sort: RoomSort): EmergencyRoom[] {
  const next = [...rooms];
  if (sort === 'distance') {
    next.sort((a, b) => a.distanceKm - b.distanceKm);
    return next;
  }

  // More available beds first; unknown bed counts sink to the bottom.
  next.sort((a, b) => {
    const aBeds = a.availableBeds;
    const bBeds = b.availableBeds;
    const aKnown = typeof aBeds === 'number';
    const bKnown = typeof bBeds === 'number';
    if (aKnown && !bKnown) return -1;
    if (!aKnown && bKnown) return 1;
    if (aKnown && bKnown && aBeds !== bBeds) return bBeds - aBeds;
    return a.distanceKm - b.distanceKm;
  });
  return next;
}

export function EmergencyFinderScreen({
  colors,
  onBack,
}: {
  colors: ThemeColors;
  onBack: () => void;
}) {
  const styles = useEmergencyStyles(colors);
  const [state, setState] = useState<FinderState>('locating');
  const [rooms, setRooms] = useState<EmergencyRoom[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roomSort, setRoomSort] = useState<RoomSort>('distance');

  const mapRef = useRef<EmergencyMapHandle>(null);
  const listRef = useRef<ScrollView>(null);
  const cardOffsets = useRef<Record<string, number>>({});

  const findRooms = useCallback(async (options?: { keepResults?: boolean }) => {
    const keepResults = Boolean(options?.keepResults);
    setErrorMessage(undefined);
    if (!keepResults) {
      setRooms([]);
      setSelectedId(null);
      setUserLocation(null);
    }

    try {
      const network = await NetInfo.fetch();
      if (network.isConnected === false || network.isInternetReachable === false) {
        if (!keepResults) setState('offline');
        return;
      }

      // 위치 권한은 앱 시작이 아니라 응급실 조회 시에만 요청합니다.
      if (!keepResults) setState('locating');
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        if (!keepResults) setState('permission-denied');
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (!keepResults) setState('location-disabled');
        return;
      }

      // 시뮬레이터는 Cupertino 등으로 잡히는 경우가 많아 강남역으로 고정
      const currentLocation: Coordinate = Device.isDevice
        ? await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }).then((position) => ({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
        : SIMULATOR_LOCATION;

      setUserLocation(currentLocation);

      if (!keepResults) setState('loading');
      const result = await fetchNearbyEmergencyRooms(currentLocation);
      setRooms(result.rooms);
      setFetchedAt(result.fetchedAt);
      setSelectedId(result.rooms[0]?.id ?? null);
      setState(result.rooms.length > 0 ? 'ready' : 'empty');
    } catch (error) {
      if (keepResults) return;

      if (error instanceof EmergencyRoomsConfigurationError) {
        setState('configuration-error');
        setErrorMessage(error.message);
        return;
      }
      setState('api-error');
      setErrorMessage(
        error instanceof Error ? error.message : '응급실 정보를 불러오지 못했어요.',
      );
    }
  }, []);

  const refreshRooms = useCallback(async () => {
    if (refreshing || state === 'locating' || state === 'loading') return;
    setRefreshing(true);
    try {
      await findRooms({ keepResults: state === 'ready' && rooms.length > 0 });
    } finally {
      setRefreshing(false);
    }
  }, [findRooms, refreshing, rooms.length, state]);

  // Entering this screen starts the search immediately (no confirm button).
  useEffect(() => {
    void findRooms();
  }, [findRooms]);

  const isBusy = state === 'locating' || state === 'loading' || refreshing;
  const canShowNativeMap = Boolean(userLocation) || rooms.length > 0;
  const resultsOffsetRef = useRef(0);

  const sortedRooms = useMemo(() => sortRooms(rooms, roomSort), [rooms, roomSort]);

  const selectFromMarker = useCallback((id: string) => {
    setSelectedId(id);
    const offset = cardOffsets.current[id];
    if (typeof offset === 'number') {
      listRef.current?.scrollTo({
        y: Math.max(0, resultsOffsetRef.current + offset - 12),
        animated: true,
      });
    }
  }, []);

  const selectFromCard = useCallback(
    (room: EmergencyRoom) => {
      setSelectedId(room.id);
      mapRef.current?.focusCoordinate(room.location, 14);
    },
    [],
  );

  const onCardLayout = (id: string, event: LayoutChangeEvent) => {
    cardOffsets.current[id] = event.nativeEvent.layout.y;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="홈으로 돌아가기"
        >
          <Ionicons name="chevron-back" size={23} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          내 주변 응급실
        </Text>
        <View style={styles.backButton} />
      </View>

      {canShowNativeMap ? (
        <EmergencyMap
          ref={mapRef}
          colors={colors}
          height={MAP_HEIGHT}
          userLocation={userLocation}
          rooms={rooms}
          selectedId={selectedId}
          onSelectRoom={selectFromMarker}
        />
      ) : (
        <View style={[styles.mapPlaceholder, { height: MAP_HEIGHT }]}>
          {isBusy ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <>
              <Ionicons name="map-outline" size={26} color={colors.accent} />
              <Text style={styles.mapPlaceholderText}>
                {state === 'permission-denied' || state === 'location-disabled'
                  ? '현재 위치를 확인할 수 없어요'
                  : state === 'api-error' || state === 'offline' || state === 'configuration-error'
                    ? '지도를 표시하려면 다시 시도해 주세요'
                    : '주변 응급실 지도를 준비 중이에요'}
              </Text>
            </>
          )}
        </View>
      )}

      <ScrollView
        ref={listRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refreshRooms()}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        <Pressable
          style={styles.call119}
          onPress={() => void Linking.openURL(telHref('119'))}
          accessibilityRole="button"
          accessibilityLabel="119 전화"
        >
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.call119Text}>위급하면 먼저 119에 전화하세요</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </Pressable>

        <Text style={styles.privacyNote}>
          현재 위치는 주변 응급실 검색에만 사용되며 저장하지 않아요.
        </Text>

        {state === 'ready' ? (
          <View
            style={styles.results}
            onLayout={(event) => {
              resultsOffsetRef.current = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.resultTitle}>가까운 응급실</Text>
                <Pressable
                  style={[styles.refreshChip, isBusy ? styles.refreshChipDisabled : null]}
                  onPress={() => void refreshRooms()}
                  disabled={isBusy}
                  accessibilityRole="button"
                  accessibilityLabel="응급실 목록 새로고침"
                >
                  {isBusy ? (
                    <ActivityIndicator size="small" color={colors.accent} />
                  ) : (
                    <>
                      <Ionicons name="refresh" size={14} color={colors.accent} />
                      <Text style={styles.refreshChipText}>새로고침</Text>
                    </>
                  )}
                </Pressable>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.updatedAt}>
                  {fetchedAt
                    ? `현재 위치 기준 · ${formatFetchedAt(fetchedAt)}`
                    : '현재 위치 기준'}
                </Text>
                <Text style={styles.source}>국립중앙의료원 제공 정보</Text>
              </View>
              <View style={styles.sortRow} accessibilityRole="tablist">
                <Pressable
                  style={[
                    styles.sortChip,
                    roomSort === 'distance' ? styles.sortChipActive : null,
                  ]}
                  onPress={() => setRoomSort('distance')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: roomSort === 'distance' }}
                  accessibilityLabel="가까운 순으로 정렬"
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      roomSort === 'distance' ? styles.sortChipTextActive : null,
                    ]}
                  >
                    가까운순
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.sortChip, roomSort === 'beds' ? styles.sortChipActive : null]}
                  onPress={() => setRoomSort('beds')}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: roomSort === 'beds' }}
                  accessibilityLabel="병상 많은 순으로 정렬"
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      roomSort === 'beds' ? styles.sortChipTextActive : null,
                    ]}
                  >
                    병상 많은순
                  </Text>
                </Pressable>
              </View>
            </View>

            {sortedRooms.map((room) => {
              const selected = room.id === selectedId;
              return (
                <Pressable
                  key={room.id}
                  onLayout={(event) => onCardLayout(room.id, event)}
                  onPress={() => selectFromCard(room)}
                  style={[styles.roomCard, selected ? styles.roomCardSelected : null]}
                >
                  <View style={styles.roomHeading}>
                    <Text style={styles.roomName} numberOfLines={2}>
                      {room.name}
                    </Text>
                    <Text style={styles.distance}>{formatDistance(room.distanceKm)}</Text>
                  </View>
                  <Text style={styles.roomAddress} numberOfLines={2}>
                    {room.address}
                  </Text>
                  {typeof room.availableBeds === 'number' ? (
                    <View
                      style={[
                        styles.bedBadge,
                        room.availableBeds > 0
                          ? styles.bedBadgeAvailable
                          : styles.bedBadgeUnavailable,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bedBadgeText,
                          room.availableBeds > 0
                            ? styles.bedBadgeTextAvailable
                            : styles.bedBadgeTextUnavailable,
                        ]}
                      >
                        {formatBedLabel(room.availableBeds)}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.bedBadge, styles.bedBadgeUnknown]}>
                      <Text style={[styles.bedBadgeText, styles.bedBadgeTextUnknown]}>
                        실시간 병상 정보 없음
                      </Text>
                    </View>
                  )}
                  <View style={styles.roomActions}>
                    {room.emergencyPhone ?? room.phone ? (
                      <Pressable
                        style={styles.roomAction}
                        onPress={() =>
                          void Linking.openURL(
                            telHref(room.emergencyPhone ?? room.phone ?? ''),
                          )
                        }
                      >
                        <Ionicons name="call-outline" size={15} color={colors.accent} />
                        <Text style={styles.roomActionText}>전화</Text>
                      </Pressable>
                    ) : null}
                    <Pressable
                      style={styles.roomAction}
                      onPress={() =>
                        void openDirections(room.location, {
                          destinationName: room.name,
                          origin: userLocation,
                        })
                      }
                    >
                      <Ionicons name="navigate-outline" size={15} color={colors.accent} />
                      <Text style={styles.roomActionText}>길찾기</Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          renderFinderState({
            state,
            colors,
            errorMessage,
            onFind: () => void findRooms(),
            onOpenSettings: () => void Linking.openSettings(),
          })
        )}
      </ScrollView>
    </View>
  );
}

function formatBedLabel(availableBeds: number): string {
  if (availableBeds > 0) return `응급실 일반병상 ${availableBeds}병상 이용 가능`;
  if (availableBeds === 0) return '응급실 일반병상 여유 없음';
  return '응급실 과밀 (여유 병상 없음)';
}

function formatFetchedAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function renderFinderState({
  state,
  colors,
  errorMessage,
  onFind,
  onOpenSettings,
}: {
  state: FinderState;
  colors: ThemeColors;
  errorMessage?: string;
  onFind: () => void;
  onOpenSettings: () => void;
}) {
  const styles = finderStatusStyles(colors);
  const isBusy = state === 'locating' || state === 'loading';
  const message = {
    idle: '현재 위치를 확인하고 있어요.',
    locating: '현재 위치를 확인하고 있어요.',
    loading: '응급실 정보를 불러오고 있어요.',
    'permission-denied': '현재 위치를 확인할 수 없어요. 위치 권한을 확인해 주세요.',
    'location-disabled': '기기의 위치 서비스가 꺼져 있어요.',
    offline: '인터넷 연결을 확인한 뒤 다시 시도해 주세요.',
    'configuration-error': errorMessage ?? '응급실 정보 연결이 아직 설정되지 않았어요.',
    'api-error': errorMessage ?? '응급실 정보를 불러오지 못했어요.',
    empty: '주변에서 응급실을 찾지 못했어요.',
    ready: '',
  }[state];

  return (
    <View style={styles.box}>
      {isBusy ? (
        <>
          <View style={styles.mapSkeleton} />
          <View style={styles.cardSkeleton} />
          <View style={[styles.cardSkeleton, styles.cardSkeletonShort]} />
          <ActivityIndicator color={colors.accent} style={{ marginTop: 8 }} />
        </>
      ) : (
        <Ionicons name="location-outline" size={28} color={colors.accent} />
      )}
      <Text style={styles.message}>{message}</Text>
      {state === 'permission-denied' || state === 'location-disabled' ? (
        <Pressable style={styles.secondaryButton} onPress={onOpenSettings}>
          <Text style={styles.secondaryText}>위치 권한 확인</Text>
        </Pressable>
      ) : null}
      {!isBusy ? (
        <Pressable style={styles.primaryButton} onPress={onFind}>
          <Text style={styles.primaryText}>다시 시도</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function useEmergencyStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      paddingHorizontal: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.bg,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topTitle: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      includeFontPadding: false,
    },
    mapPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.heroBg,
      paddingHorizontal: 24,
    },
    mapPlaceholderText: {
      color: colors.textSecondary,
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
    },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
    call119: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.accent,
    },
    call119Text: { color: '#fff', fontSize: 14, fontWeight: '700', flexShrink: 1 },
    privacyNote: {
      color: colors.textTertiary,
      fontSize: 11,
      lineHeight: 16,
      marginTop: 8,
      marginBottom: 4,
    },
    results: { marginTop: 10 },
    sectionHeader: { marginBottom: 8 },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    resultTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
    refreshChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.accentMuted,
    },
    refreshChipDisabled: { opacity: 0.7 },
    refreshChipText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
    metaRow: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    updatedAt: { color: colors.textSecondary, fontSize: 12, flex: 1 },
    source: { color: colors.textTertiary, fontSize: 11 },
    sortRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sortChip: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    sortChipActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accentMuted,
    },
    sortChipText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    sortChipTextActive: {
      color: colors.accent,
      fontWeight: '800',
    },
    roomCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 13,
      marginTop: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    roomCardSelected: {
      borderColor: colors.accent,
      borderWidth: 1.5,
      backgroundColor: colors.accentMuted,
    },
    roomHeading: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    roomName: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    distance: { color: colors.accent, fontSize: 13, fontWeight: '800' },
    roomAddress: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 4,
    },
    bedBadge: {
      alignSelf: 'flex-start',
      marginTop: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    bedBadgeAvailable: { backgroundColor: 'rgba(34, 140, 84, 0.12)' },
    bedBadgeUnavailable: { backgroundColor: 'rgba(255, 90, 85, 0.12)' },
    bedBadgeUnknown: { backgroundColor: colors.tipBg },
    bedBadgeText: { fontSize: 11, fontWeight: '700' },
    bedBadgeTextAvailable: { color: '#1B7A45' },
    bedBadgeTextUnavailable: { color: colors.accent },
    bedBadgeTextUnknown: { color: colors.textTertiary, fontWeight: '600' },
    roomActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
    roomAction: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingVertical: 9,
      borderRadius: 10,
      backgroundColor: colors.accentMuted,
    },
    roomActionText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  });
}

function finderStatusStyles(colors: ThemeColors) {
  return StyleSheet.create({
    box: {
      alignItems: 'center',
      marginTop: 16,
      padding: 20,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    mapSkeleton: {
      alignSelf: 'stretch',
      height: 88,
      borderRadius: 12,
      backgroundColor: colors.divider,
      marginBottom: 10,
    },
    cardSkeleton: {
      alignSelf: 'stretch',
      height: 64,
      borderRadius: 12,
      backgroundColor: colors.divider,
      marginBottom: 8,
    },
    cardSkeletonShort: { height: 48, opacity: 0.7 },
    message: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      marginTop: 12,
    },
    primaryButton: {
      alignSelf: 'stretch',
      alignItems: 'center',
      paddingVertical: 13,
      borderRadius: 12,
      backgroundColor: colors.accent,
      marginTop: 16,
    },
    primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    secondaryButton: { paddingVertical: 10, marginTop: 6 },
    secondaryText: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  });
}
