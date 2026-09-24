import { Dimensions, Platform } from 'react-native';

export type HomeDensity = 'compact' | 'regular' | 'comfortable';

/** 짧은 기기에서 홈이 답답해지지 않도록 세로 밀도를 나눕니다. */
export function getHomeDensity(): HomeDensity {
  const { height } = Dimensions.get('window');
  // Android는 시스템 내비/상태바 때문에 체감 높이가 더 짧음
  if (Platform.OS === 'android') {
    if (height < 780) return 'compact';
    if (height < 900) return 'regular';
    return 'comfortable';
  }
  if (height < 720) return 'compact';
  if (height < 840) return 'regular';
  return 'comfortable';
}

export type HomeMetrics = {
  logoWidth: number;
  logoHeight: number;
  headerPadTop: number;
  headerPadBottom: number;
  subtitleSize: number;
  subtitleLineHeight: number;
  heroPadBottom: number;
  searchMinHeight: number;
  searchMarginBottom: number;
  chipPadVertical: number;
  chipPadHorizontal: number;
  erPadVertical: number;
  erMarginTop: number;
  sectionTitleSize: number;
  sectionTitleMarginBottom: number;
  cardPadVertical: number;
  cardPadHorizontal: number;
  cardNumSize: number;
  cardLabelSize: number;
  callMarginTop: number;
  callPadVertical: number;
  tileMinHeight: number;
  tilePadVertical: number;
  categoryBrowsePadTop: number;
  listPadBottom: number;
};

export function getHomeMetrics(density: HomeDensity = getHomeDensity()): HomeMetrics {
  switch (density) {
    case 'compact':
      return {
        logoWidth: 168,
        logoHeight: 58,
        headerPadTop: 8,
        headerPadBottom: 2,
        subtitleSize: 13,
        subtitleLineHeight: 18,
        heroPadBottom: 6,
        searchMinHeight: 44,
        searchMarginBottom: 8,
        chipPadVertical: 8,
        chipPadHorizontal: 12,
        erPadVertical: 10,
        erMarginTop: 6,
        sectionTitleSize: 17,
        sectionTitleMarginBottom: 8,
        cardPadVertical: 11,
        cardPadHorizontal: 12,
        cardNumSize: 22,
        cardLabelSize: 14,
        callMarginTop: 8,
        callPadVertical: 8,
        tileMinHeight: 62,
        tilePadVertical: 10,
        categoryBrowsePadTop: 2,
        listPadBottom: Platform.OS === 'android' ? 56 : 40,
      };
    case 'regular':
      return {
        logoWidth: 196,
        logoHeight: 70,
        headerPadTop: 12,
        headerPadBottom: 6,
        subtitleSize: 14,
        subtitleLineHeight: 20,
        heroPadBottom: 10,
        searchMinHeight: 48,
        searchMarginBottom: 10,
        chipPadVertical: 9,
        chipPadHorizontal: 13,
        erPadVertical: 12,
        erMarginTop: 8,
        sectionTitleSize: 18,
        sectionTitleMarginBottom: 10,
        cardPadVertical: 13,
        cardPadHorizontal: 13,
        cardNumSize: 24,
        cardLabelSize: 15,
        callMarginTop: 10,
        callPadVertical: 9,
        tileMinHeight: 70,
        tilePadVertical: 11,
        categoryBrowsePadTop: 4,
        listPadBottom: Platform.OS === 'android' ? 48 : 32,
      };
    default:
      return {
        logoWidth: 220,
        logoHeight: 82,
        headerPadTop: 16,
        headerPadBottom: 8,
        subtitleSize: 15,
        subtitleLineHeight: 21,
        heroPadBottom: 12,
        searchMinHeight: 52,
        searchMarginBottom: 12,
        chipPadVertical: 10,
        chipPadHorizontal: 14,
        erPadVertical: 13,
        erMarginTop: 8,
        sectionTitleSize: 19,
        sectionTitleMarginBottom: 12,
        cardPadVertical: 14,
        cardPadHorizontal: 14,
        cardNumSize: 26,
        cardLabelSize: 15,
        callMarginTop: 12,
        callPadVertical: 9,
        tileMinHeight: 76,
        tilePadVertical: 12,
        categoryBrowsePadTop: 4,
        listPadBottom: Platform.OS === 'android' ? 40 : 28,
      };
  }
}
