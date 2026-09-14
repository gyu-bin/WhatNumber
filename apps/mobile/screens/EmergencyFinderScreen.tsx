import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { telHref } from '@whatnumber/shared';
import {
  EmergencyRoomsConfigurationError,
  fetchNearbyEmergencyRooms,
} from '../services/emergency/api';
import { formatDistance } from '../services/emergency/distance';
import type { Coordinate, EmergencyRoom } from '../services/emergency/types';
import { openDirections } from '../services/maps';
import type { ThemeColors } from '../theme';

/** iOS/Android 시뮬레이터 테스트용: 용인시 수지구 (수지구청 부근) */
const SIMULATOR_LOCATION: Coordinate = {
  latitude: 37.3225,
  longitude: 127.0975,
};

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

export function EmergencyFinderScreen({
  colors,
  onBack,
}: {
  colors: ThemeColors;
  onBack: () => void;
}) {
  const styles = useEmergencyStyles(colors);
  const [state, setState] = useState<FinderState>('idle');
  const [rooms, setRooms] = useState<EmergencyRoom[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);

  const findRooms = useCallback(async (options?: { keepResults?: boolean }) => {
    const keepResults = Boolean(options?.keepResults);
    setErrorMessage(undefined);
    if (!keepResults) setRooms([]);

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

      // 시뮬레이터는 Cupertino 등으로 잡히는 경우가 많아 용인 수지구로 고정
      const currentLocation: Coordinate = Device.isDevice
        ? await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }).then((position) => ({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
        : SIMULATOR_LOCATION;

      if (!keepResults) setState('loading');
      const result = await fetchNearbyEmergencyRooms(currentLocation);
      setRooms(result.rooms);
      setFetchedAt(result.fetchedAt);
      setState(result.rooms.length > 0 ? 'ready' : 'empty');
    } catch (error) {
      if (keepResults) return;

      if (error instanceof EmergencyRoomsConfigurationError) {
        setState('configuration-error');
        setErrorMessage(error.message);
        return;
      }
      setState('api-error');
      setErrorMessage(error instanceof Error ? error.message : '응급실 정보를 불러오지 못했어요.');
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

  // 응급실 화면에 들어오면 바로 조회(이때 위치 권한 팝업)
  const didAutoStart = useRef(false);
  useEffect(() => {
    if (didAutoStart.current) return;
    didAutoStart.current = true;
    void findRooms();
  }, [findRooms]);

  const isBusy = state === 'locating' || state === 'loading' || refreshing;

  const stateContent = renderFinderState({
    state,
    colors,
    errorMessage,
    onFind: () => void findRooms(),
    onOpenSettings: () => void Linking.openURL('app-settings:'),
  });

  return (
    <View style={styles.screen}>
      <ScrollView
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

        {state !== 'ready' ? (
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="medical" size={22} color={colors.accent} />
            </View>
            <Text style={styles.title}>가까운 응급실을 찾아드릴게요</Text>
            <Text style={styles.description}>현재 위치는 검색할 때만 사용하며 저장하지 않아요.</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.call119, state === 'ready' ? styles.call119Compact : null]}
          onPress={() => void Linking.openURL(telHref('119'))}
          accessibilityRole="button"
          accessibilityLabel="119 전화"
        >
          <Ionicons name="call" size={15} color="#fff" />
          <Text style={styles.call119Text}>위급하면 먼저 119에 전화하세요</Text>
        </Pressable>

        {state === 'ready' ? (
          <View style={styles.results}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>가까운 응급실</Text>
              <Text style={styles.source}>국립중앙의료원 제공 정보</Text>
            </View>
            {fetchedAt ? (
              <Text style={styles.updatedAt}>조회 시각 {formatFetchedAt(fetchedAt)}</Text>
            ) : null}
            {rooms.map((room) => (
              <View key={room.id} style={styles.roomCard}>
                <View style={styles.roomHeading}>
                  <View style={styles.roomTitleArea}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <Text style={styles.roomAddress}>{room.address}</Text>
                  </View>
                  <Text style={styles.distance}>{formatDistance(room.distanceKm)}</Text>
                </View>
                {typeof room.availableBeds === 'number' ? (
                  <Text
                    style={[
                      styles.bedInfo,
                      room.availableBeds > 0 ? styles.bedAvailable : styles.bedUnavailable,
                    ]}
                  >
                    {formatBedLabel(room.availableBeds)}
                  </Text>
                ) : (
                  <Text style={styles.bedInfo}>실시간 병상 정보 없음</Text>
                )}
                <View style={styles.roomActions}>
                  {(room.emergencyPhone ?? room.phone) ? (
                    <Pressable
                      style={styles.roomAction}
                      onPress={() =>
                        void Linking.openURL(telHref(room.emergencyPhone ?? room.phone ?? ''))
                      }
                    >
                      <Ionicons name="call-outline" size={16} color={colors.accent} />
                      <Text style={styles.roomActionText}>전화</Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    style={styles.roomAction}
                    onPress={() => void openDirections(room.location)}
                  >
                    <Ionicons name="navigate-outline" size={16} color={colors.accent} />
                    <Text style={styles.roomActionText}>길찾기</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            <Pressable style={styles.retryLink} onPress={() => void refreshRooms()}>
              <Text style={styles.retryText}>현재 위치로 다시 찾기</Text>
            </Pressable>
          </View>
        ) : (
          stateContent
        )}
      </ScrollView>

      <Pressable
        style={[styles.fab, isBusy ? styles.fabDisabled : null]}
        onPress={() => void refreshRooms()}
        disabled={isBusy}
        accessibilityRole="button"
        accessibilityLabel="응급실 목록 새로고침"
      >
        {isBusy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="refresh" size={22} color="#fff" />
        )}
      </Pressable>
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
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
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
  const isBusy = state === 'locating' || state === 'loading';
  const message = {
    idle: '위치 사용을 허용하면 가까운 응급실을 거리순으로 보여드려요.',
    locating: '현재 위치를 확인하고 있어요.',
    loading: '응급실 정보를 불러오고 있어요.',
    'permission-denied': '위치 권한이 없어 가까운 응급실을 찾을 수 없어요.',
    'location-disabled': '기기의 위치 서비스가 꺼져 있어요.',
    offline: '인터넷 연결을 확인한 뒤 다시 시도해 주세요.',
    'configuration-error': errorMessage ?? '응급실 정보 연결이 아직 설정되지 않았어요.',
    'api-error': errorMessage ?? '응급실 정보를 불러오지 못했어요.',
    empty: '현재 위치 주변의 응급실 정보를 찾지 못했어요.',
    ready: '',
  }[state];

  return (
    <View style={finderStatusStyles(colors).box}>
      <Ionicons
        name={isBusy ? 'sync-outline' : 'location-outline'}
        size={28}
        color={colors.accent}
      />
      <Text style={finderStatusStyles(colors).message}>{message}</Text>
      {state === 'permission-denied' || state === 'location-disabled' ? (
        <Pressable style={finderStatusStyles(colors).secondaryButton} onPress={onOpenSettings}>
          <Text style={finderStatusStyles(colors).secondaryText}>설정 열기</Text>
        </Pressable>
      ) : null}
      {!isBusy ? (
        <Pressable style={finderStatusStyles(colors).primaryButton} onPress={onFind}>
          <Text style={finderStatusStyles(colors).primaryText}>
            {state === 'idle' ? '내 주변 응급실 찾기' : '다시 시도'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function useEmergencyStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 96 },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 40,
      marginBottom: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    topTitle: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      includeFontPadding: false,
    },
    hero: { alignItems: 'center', paddingHorizontal: 18, paddingBottom: 12 },
    heroIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentMuted,
      marginBottom: 10,
    },
    title: { color: colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: -0.6 },
    description: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 6,
      textAlign: 'center',
    },
    call119: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.accent,
    },
    call119Compact: {
      paddingVertical: 10,
      borderRadius: 11,
    },
    call119Text: { color: '#fff', fontSize: 14, fontWeight: '700' },
    results: { marginTop: 14 },
    resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    resultTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800' },
    source: { color: colors.textTertiary, fontSize: 11 },
    updatedAt: { color: colors.textTertiary, fontSize: 12, marginTop: 4, marginBottom: 8 },
    roomCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      marginTop: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    roomHeading: { flexDirection: 'row', gap: 10 },
    roomTitleArea: { flex: 1 },
    roomName: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
    roomAddress: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 5 },
    distance: { color: colors.accent, fontSize: 14, fontWeight: '800' },
    bedInfo: { fontSize: 12, marginTop: 11, color: colors.textSecondary },
    bedAvailable: { color: colors.accent, fontWeight: '700' },
    bedUnavailable: { color: colors.textTertiary, fontWeight: '600' },
    roomActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
    roomAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      minWidth: 82,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.accentMuted,
    },
    roomActionText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
    retryLink: { alignSelf: 'center', paddingVertical: 18 },
    retryText: { color: colors.accent, fontSize: 14, fontWeight: '700' },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 18,
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    fabDisabled: { opacity: 0.72 },
  });
}

function finderStatusStyles(colors: ThemeColors) {
  return StyleSheet.create({
    box: {
      alignItems: 'center',
      marginTop: 24,
      padding: 24,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
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
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.accent,
      marginTop: 18,
    },
    primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    secondaryButton: { paddingVertical: 10, marginTop: 8 },
    secondaryText: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  });
}
