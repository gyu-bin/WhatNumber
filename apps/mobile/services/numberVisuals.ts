import type { ComponentProps } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Category, NumberItem, OrganizationContact } from '@whatnumber/shared';

type IconName = ComponentProps<typeof Ionicons>['name'];

const CAT_IONICON: Record<Category, IconName> = {
  '긴급/안전': 'shield-checkmark',
  '교통/차량': 'car-outline',
  '주거/생활': 'home-outline',
  '법률/금융': 'briefcase-outline',
  '가족/복지': 'people-outline',
  '고용/노동': 'construct-outline',
  '민원/행정': 'document-text-outline',
  '통신/디지털': 'phone-portrait-outline',
};

/** 로고가 없을 때만 쓰는 Ionicons */
const ID_IONICON: Record<string, IconName> = {
  e1: 'medkit-outline',
  e2: 'flame',
  e3: 'shield',
  e4: 'business-outline',
  e5: 'hand-left-outline',
  e6: 'airplane-outline',
  e7: 'heart-outline',
  e8: 'eye-outline',
  e9: 'eye-outline',
  e10: 'radio-outline',
  e11: 'ribbon-outline',
  e12: 'boat-outline',
  e13: 'heart-dislike-outline',
  e14: 'leaf-outline',
  e15: 'restaurant-outline',
  c1: 'trail-sign-outline',
  c2: 'car-sport-outline',
  c3: 'car-outline',
  c4: 'medkit-outline',
  c6: 'document-text-outline',
  c7: 'help-buoy-outline',
  c8: 'bus-outline',
  c9: 'train-outline',
  h1: 'mail-outline',
  h2: 'volume-high-outline',
  h3: 'home-outline',
  h4: 'flame-outline',
  h5: 'flash-outline',
  h6: 'water-outline',
  h7: 'cloudy-outline',
  l1: 'scale-outline',
  l2: 'cash-outline',
  l3: 'shield-checkmark-outline',
  l4: 'warning-outline',
  l5: 'lock-closed-outline',
  l6: 'chatbubbles-outline',
  l7: 'calculator-outline',
  l8: 'receipt-outline',
  l9: 'laptop-outline',
  l10: 'alert-circle-outline',
  l11: 'scale-outline',
  l12: 'trending-down-outline',
  l13: 'sunny-outline',
  l14: 'people-circle-outline',
  d1: 'radio-outline',
  d2: 'call-outline',
  d3: 'tv-outline',
  d4: 'ban-outline',
  f1: 'people-outline',
  f2: 'school-outline',
  f3: 'heart-outline',
  f4: 'camera-outline',
  f5: 'globe-outline',
  f6: 'happy-outline',
  f7: 'card-outline',
  f8: 'alert-outline',
  f9: 'search-outline',
  w1: 'briefcase-outline',
  w2: 'construct-outline',
  w3: 'book-outline',
  w4: 'chatbox-ellipses-outline',
  g1: 'call-outline',
  g2: 'business-outline',
  g3: 'card-outline',
  g4: 'business-outline',
  g5: 'business-outline',
  g6: 'business-outline',
  g7: 'business-outline',
  g8: 'business-outline',
  g9: 'business-outline',
  g10: 'business-outline',
  g11: 'business-outline',
  g12: 'business-outline',
  g13: 'business-outline',
  g14: 'business-outline',
  g15: 'business-outline',
  g16: 'business-outline',
  g17: 'business-outline',
  g18: 'business-outline',
  g19: 'business-outline',
  g20: 'cube-outline',
  g21: 'ribbon-outline',
};

const SAFE_FALLBACK: IconName = 'call-outline';

const ORG_LOGO_BY_ORGANIZATION: Record<string, ImageSourcePropType> = {
  삼성화재: require('../assets/org-logos/samsung-fire.png'),
  DB손해보험: require('../assets/org-logos/db-insure.png'),
  KB손해보험: require('../assets/org-logos/kb-insure.png'),
  현대해상: require('../assets/org-logos/hyundai-fire.png'),
  메리츠화재: require('../assets/org-logos/meritz-fire.png'),
  한화손해보험: require('../assets/org-logos/hanwha-insure.png'),
  롯데손해보험: require('../assets/org-logos/lotte-insure.png'),
  흥국화재: require('../assets/org-logos/heungkuk-fire.png'),
  MG손해보험: require('../assets/org-logos/mg-insure.png'),
  AXA손해보험: require('../assets/org-logos/axa-insure.png'),
  하나손해보험: require('../assets/org-logos/hana-insure.png'),
  캐롯손해보험: require('../assets/org-logos/carrot-insure.png'),
  현대카드: require('../assets/org-logos/hyundai-card.png'),
  삼성카드: require('../assets/org-logos/samsung-card.png'),
  롯데카드: require('../assets/org-logos/lotte-card.png'),
  신한카드: require('../assets/org-logos/shinhan-card.png'),
  KB국민카드: require('../assets/org-logos/kb-card.png'),
  우리카드: require('../assets/org-logos/woori-card.png'),
  하나카드: require('../assets/org-logos/hana-card.png'),
  NH농협카드: require('../assets/org-logos/nh-card.png'),
  KB국민은행: require('../assets/org-logos/kb-bank.png'),
  우리은행: require('../assets/org-logos/woori-bank.png'),
};

/** 공공번호 전체 기관 마크 매핑 */
const ID_LOGO: Record<string, ImageSourcePropType> = {
  // 긴급
  e1: require('../assets/org-logos/mohw-129.png'),
  e2: require('../assets/org-logos/fire-119.png'),
  e3: require('../assets/org-logos/police-112.png'),
  e4: require('../assets/org-logos/ems-1339.png'),
  e5: require('../assets/org-logos/crime-victim.png'),
  e6: require('../assets/org-logos/mofa-consul.png'),
  e7: require('../assets/org-logos/mental-109.png'),
  e8: require('../assets/org-logos/nis-111.png'),
  e9: require('../assets/org-logos/police-113.png'),
  e10: require('../assets/org-logos/defense-1338.png'),
  e11: require('../assets/org-logos/dssc-1337.png'),
  e12: require('../assets/org-logos/coast-122.png'),
  e13: require('../assets/org-logos/suicide-1393.png'),
  e14: require('../assets/org-logos/env-128.png'),
  e15: require('../assets/org-logos/food-1399.png'),
  // 교통
  c1: require('../assets/org-logos/molit-road.png'),
  c2: require('../assets/org-logos/molit-road.png'),
  c3: require('../assets/org-logos/police-112.png'),
  c4: require('../assets/org-logos/fire-119.png'),
  c6: require('../assets/org-logos/hit-run.png'),
  c7: require('../assets/org-logos/mois.png'),
  c8: require('../assets/org-logos/police-lost-182.png'),
  c9: require('../assets/org-logos/korail.png'),
  // 주거
  h1: require('../assets/org-logos/post-address.png'),
  h2: require('../assets/org-logos/noise-center.png'),
  h3: require('../assets/org-logos/jeonse.png'),
  h4: require('../assets/org-logos/gas.png'),
  h5: require('../assets/org-logos/kepco.png'),
  h6: require('../assets/org-logos/kwater.png'),
  h7: require('../assets/org-logos/kma.png'),
  // 법률·금융·통신
  l1: require('../assets/org-logos/klac-132.png'),
  l2: require('../assets/org-logos/nhis.png'),
  l3: require('../assets/org-logos/fss.png'),
  l4: require('../assets/org-logos/phishing-1398.png'),
  l5: require('../assets/org-logos/pipc.png'),
  l6: require('../assets/org-logos/kca.png'),
  l7: require('../assets/org-logos/nts.png'),
  l8: require('../assets/org-logos/local-tax.png'),
  l9: require('../assets/org-logos/kisa.png'),
  l10: require('../assets/org-logos/spo.png'),
  l11: require('../assets/org-logos/ftc.png'),
  l12: require('../assets/org-logos/credit-recovery.png'),
  l13: require('../assets/org-logos/kiss.png'),
  l14: require('../assets/org-logos/nhrck.png'),
  d1: require('../assets/org-logos/kcc.png'),
  d2: require('../assets/org-logos/kt-114.png'),
  d3: require('../assets/org-logos/kocsc.png'),
  d4: require('../assets/org-logos/kisa.png'),
  // 가족·복지
  f1: require('../assets/org-logos/elder-care.png'),
  f2: require('../assets/org-logos/school-117.png'),
  f3: require('../assets/org-logos/women-1366.png'),
  f4: require('../assets/org-logos/digital-sexcrime.png'),
  f5: require('../assets/org-logos/immigration.png'),
  f6: require('../assets/org-logos/youth-1388.png'),
  f7: require('../assets/org-logos/nps.png'),
  f8: require('../assets/org-logos/elder-abuse.png'),
  f9: require('../assets/org-logos/police-lost-182.png'),
  // 고용
  w1: require('../assets/org-logos/moel.png'),
  w2: require('../assets/org-logos/comwel.png'),
  w3: require('../assets/org-logos/hrd.png'),
  w4: require('../assets/org-logos/equal-work.png'),
  // 행정·지역
  g1: require('../assets/org-logos/mois.png'),
  g2: require('../assets/org-logos/seoul-120.png'),
  g3: require('../assets/org-logos/gov24.png'),
  g4: require('../assets/org-logos/gg-120.png'),
  g5: require('../assets/org-logos/incheon-120.png'),
  g6: require('../assets/org-logos/busan-120.png'),
  g7: require('../assets/org-logos/daegu-120.png'),
  g8: require('../assets/org-logos/gwangju-120.png'),
  g9: require('../assets/org-logos/daejeon-120.png'),
  g10: require('../assets/org-logos/ulsan-120.png'),
  g11: require('../assets/org-logos/sejong-120.png'),
  g12: require('../assets/org-logos/gangwon-120.png'),
  g13: require('../assets/org-logos/chungbuk-120.png'),
  g14: require('../assets/org-logos/chungnam-120.png'),
  g15: require('../assets/org-logos/jeonbuk-120.png'),
  g16: require('../assets/org-logos/jeonnam-120.png'),
  g17: require('../assets/org-logos/gyeongbuk-120.png'),
  g18: require('../assets/org-logos/gyeongnam-120.png'),
  g19: require('../assets/org-logos/jeju-120.png'),
  g20: require('../assets/org-logos/customs.png'),
  g21: require('../assets/org-logos/mma.png'),
};

function isOrganizationContact(item: NumberItem): item is OrganizationContact {
  return 'organization' in item && typeof (item as OrganizationContact).organization === 'string';
}

export function getNumberLogoSource(item: NumberItem): ImageSourcePropType | undefined {
  if (isOrganizationContact(item)) {
    return ORG_LOGO_BY_ORGANIZATION[item.organization];
  }
  return ID_LOGO[item.id];
}

export function getNumberIonicon(item: NumberItem): IconName {
  const byId = ID_IONICON[item.id];
  if (byId) return byId;
  if (isOrganizationContact(item)) {
    if (item.organizationType === 'insurance') return 'shield-checkmark-outline';
    if (item.organizationType === 'card') return 'card-outline';
    if (item.organizationType === 'bank') return 'wallet-outline';
  }
  return CAT_IONICON[item.cat] ?? SAFE_FALLBACK;
}
