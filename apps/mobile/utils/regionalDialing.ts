export const REGIONAL_AREA_CODES = [
  { code: '02', labels: ['서울', 'Seoul', '首尔', 'ソウル'] },
  { code: '031', labels: ['경기', 'Gyeonggi', '京畿', '京畿'] },
  { code: '032', labels: ['인천', 'Incheon', '仁川', '仁川'] },
  { code: '033', labels: ['강원', 'Gangwon', '江原', '江原'] },
  { code: '041', labels: ['충남', 'Chungnam', '忠南', '忠南'] },
  { code: '042', labels: ['대전', 'Daejeon', '大田', '大田'] },
  { code: '043', labels: ['충북', 'Chungbuk', '忠北', '忠北'] },
  { code: '044', labels: ['세종', 'Sejong', '世宗', '世宗'] },
  { code: '051', labels: ['부산', 'Busan', '釜山', '釜山'] },
  { code: '052', labels: ['울산', 'Ulsan', '蔚山', '蔚山'] },
  { code: '053', labels: ['대구', 'Daegu', '大邱', '大邱'] },
  { code: '054', labels: ['경북', 'Gyeongbuk', '庆北', '慶北'] },
  { code: '055', labels: ['경남', 'Gyeongnam', '庆南', '慶南'] },
  { code: '061', labels: ['전남', 'Jeonnam', '全南', '全南'] },
  { code: '062', labels: ['광주', 'Gwangju', '光州', '光州'] },
  { code: '063', labels: ['전북', 'Jeonbuk', '全北', '全北'] },
  { code: '064', labels: ['제주', 'Jeju', '济州', '済州'] },
] as const;

export function requiresRegionalDialing(number: string): boolean {
  return number === '123' || number === '128';
}

export function regionalTelHref(number: string, code: string): string | null {
  return requiresRegionalDialing(number) && REGIONAL_AREA_CODES.some((area) => area.code === code)
    ? `tel:${code}${number}` : null;
}

export function regionalCallCopy(locale: string) {
  const index = locale.startsWith('ko') ? 0 : locale.startsWith('zh') ? 2 : locale.startsWith('ja') ? 3 : 1;
  return {
    index,
    title: ['지역 선택', 'Choose a region', '选择地区', '地域を選択'][index],
    instruction: [
      '휴대전화에서는 지역번호가 필요합니다. 연결할 지역을 선택하세요.',
      'Mobile calls require an area code. Choose the region you want to contact.',
      '手机拨打需要区号。请选择要联系的地区。',
      '携帯電話からは市外局番が必要です。連絡する地域を選んでください。',
    ][index],
    cancel: ['취소', 'Cancel', '取消', 'キャンセル'][index],
    invalid: ['목록에 있는 지역번호를 입력하세요.', 'Enter an area code from the list.', '请输入列表中的区号。', '一覧の市外局番を入力してください。'][index],
  };
}
