import { NUMBERS, type NumberItem } from './numbers';
import { ORGANIZATION_CONTACTS } from './organizationContacts';

/** 공공번호와 검증된 기업 긴급 연락처를 합친 앱 표시용 목록입니다. */
export const ALL_NUMBERS: NumberItem[] = [...NUMBERS, ...ORGANIZATION_CONTACTS];

export function getContactById(id: string): NumberItem | undefined {
  return ALL_NUMBERS.find((item) => item.id === id);
}
