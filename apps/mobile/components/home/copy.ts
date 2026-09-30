import { useTranslation } from 'react-i18next';
import type { HomeSituationId, SeasonId } from '../../data/homeContent';

type Label = { title: string; detail: string };
type HomeCopy = {
  savedHint: string;
  searchTitle: string; suggestions: string; searchSuggestions: string[]; addNumber: string; saveError: string;
  firstHeading: string; returnHeading: string; search: string; saved: string; all: string;
  categories: string; add: string; register: string; registerDetail: string; emergency: string;
  seasonal: string; fire: string; police: string;
  situations: Record<HomeSituationId, Label>; seasons: Record<SeasonId, Label>;
};
const ko: HomeCopy = {
  savedHint: '탭하여 전화, 길게 눌러 상세 정보 또는 수정',
  searchTitle: '검색', suggestions: '추천 검색어', searchSuggestions: ['교통사고', '타이어 펑크', '배터리 방전', '견인', '카드 분실', '보이스피싱'], addNumber: '번호 추가', saveError: '저장하지 못했어요. 다시 시도해주세요.',
  firstHeading: '어떤 도움이 필요하세요?', returnHeading: '무슨 일이 있으세요?', search: '상황, 기관, 번호를 검색해보세요',
  saved: '자주 쓰는 번호', all: '전체보기', categories: '모든 카테고리 보기', add: '추가', register: '자주 쓰는 번호 등록하기',
  registerDetail: '가족·병원·회사 등 자주 쓰는 번호', emergency: '내 주변 응급실 찾기', seasonal: '지금 유용한 연락처', fire: '소방·구급', police: '경찰·신고',
  situations: { health: { title: '갑자기 아파요', detail: '응급실·병원·약국' }, car: { title: '차에 문제가 있어요', detail: '사고·고장·견인' }, finance: { title: '카드·돈 문제', detail: '분실·금융사기' }, crime: { title: '사기·범죄', detail: '신고·보이스피싱' } },
  seasons: { holiday: { title: '연휴 병원·약국', detail: '휴일 의료 안내' }, rain: { title: '장마·침수 도움', detail: '기상특보·정전·신고' }, heat: { title: '폭염·정전·수도', detail: '더운 날 생활 문의' }, winter: { title: '겨울 보일러·가스', detail: '가스·전기·수도' }, tax: { title: '연말정산·세금', detail: '국세·지방세 상담' }, moving: { title: '이사철 생활 문의', detail: '주소·전기·수도' } },
};
const en: HomeCopy = {
  savedHint: 'Tap to call. Touch and hold for details or editing.',
  searchTitle: 'Search', suggestions: 'Suggested searches', searchSuggestions: ['Car accident', 'Flat tire', 'Dead battery', 'Towing', 'Lost card', 'Voice phishing'], addNumber: 'Add number', saveError: 'Could not save. Please try again.',
  firstHeading: 'How can we help?', returnHeading: 'What’s happening?', search: 'Search a situation, service or number', saved: 'Your numbers', all: 'See all', categories: 'Browse all categories', add: 'Add', register: 'Add a number you use', registerDetail: 'Family, your clinic, work and more', emergency: 'Find nearby emergency rooms', seasonal: 'Useful right now', fire: 'Fire · Ambulance', police: 'Police',
  situations: { health: { title: 'Feeling unwell', detail: 'ER · Clinics · Pharmacies' }, car: { title: 'Car trouble', detail: 'Accidents · Repairs · Towing' }, finance: { title: 'Cards & money', detail: 'Lost cards · Financial fraud' }, crime: { title: 'Scams & crime', detail: 'Reports · Voice phishing' } },
  seasons: { holiday: { title: 'Holiday medical help', detail: 'Medical information' }, rain: { title: 'Rain & flooding', detail: 'Weather · Outages · Reports' }, heat: { title: 'Heat & utilities', detail: 'Power · Water' }, winter: { title: 'Winter & gas', detail: 'Gas · Power · Water' }, tax: { title: 'Tax enquiries', detail: 'National · Local taxes' }, moving: { title: 'Moving home', detail: 'Address · Utilities' } },
};
const ja: HomeCopy = {
  savedHint: 'タップして電話。長押しで詳細表示または編集。',
  searchTitle: '検索', suggestions: 'おすすめ検索', searchSuggestions: ['交通事故', 'パンク', 'バッテリー上がり', 'けん引', 'カード紛失', '電話詐欺'], addNumber: '番号を追加', saveError: '保存できませんでした。もう一度お試しください。',
  firstHeading: 'どんなお手伝いが必要ですか？', returnHeading: 'どうしましたか？', search: '状況・機関・番号を検索', saved: 'よく使う番号', all: 'すべて', categories: 'すべてのカテゴリ', add: '追加', register: 'よく使う番号を登録', registerDetail: '家族・病院・会社など', emergency: '近くの救急医療機関を探す', seasonal: '今役立つ連絡先', fire: '消防・救急', police: '警察・通報',
  situations: { health: { title: '急な体調不良', detail: '救急・病院・薬局' }, car: { title: '車のトラブル', detail: '事故・故障・けん引' }, finance: { title: 'カード・お金', detail: '紛失・金融詐欺' }, crime: { title: '詐欺・犯罪', detail: '通報・電話詐欺' } },
  seasons: { holiday: { title: '連休の医療案内', detail: '休日の医療相談' }, rain: { title: '大雨・浸水', detail: '気象・停電・通報' }, heat: { title: '猛暑・電気・水道', detail: '夏の生活相談' }, winter: { title: '冬のガス・暖房', detail: 'ガス・電気・水道' }, tax: { title: '年末調整・税金', detail: '国税・地方税' }, moving: { title: '引越しの相談', detail: '住所・電気・水道' } },
};
const zh: HomeCopy = {
  savedHint: '轻点拨打电话，长按查看详情或编辑。',
  searchTitle: '搜索', suggestions: '推荐搜索', searchSuggestions: ['交通事故', '轮胎爆胎', '电池没电', '拖车', '银行卡丢失', '电话诈骗'], addNumber: '添加号码', saveError: '无法保存，请重试。',
  firstHeading: '您需要什么帮助？', returnHeading: '发生什么事了？', search: '搜索情况、机构或号码', saved: '常用号码', all: '查看全部', categories: '查看所有分类', add: '添加', register: '添加常用号码', registerDetail: '家人、医院、公司等常用号码', emergency: '查找附近急诊室', seasonal: '当下实用联系方式', fire: '消防·急救', police: '警察·报警',
  situations: { health: { title: '突然不舒服', detail: '急诊·医院·药店' }, car: { title: '车辆故障', detail: '事故·故障·拖车' }, finance: { title: '银行卡与钱款', detail: '丢失·金融诈骗' }, crime: { title: '诈骗与犯罪', detail: '报警·电话诈骗' } },
  seasons: { holiday: { title: '假期医疗咨询', detail: '节假日医疗指引' }, rain: { title: '暴雨与积水', detail: '天气·停电·报警' }, heat: { title: '高温·电力·供水', detail: '夏季生活咨询' }, winter: { title: '冬季供暖与燃气', detail: '燃气·电力·供水' }, tax: { title: '年度结算与税务', detail: '国税·地方税' }, moving: { title: '搬家生活咨询', detail: '地址·电力·供水' } },
};
export function useHomeCopy(): HomeCopy {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  return ({ ko, en, ja, zh } as Record<string, HomeCopy>)[language] ?? ko;
}
