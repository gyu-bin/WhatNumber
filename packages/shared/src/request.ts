export const NUMBER_REQUEST_EMAIL = 'rbqls6651@naver.com';

export interface NumberRequestForm {
  title?: string;
  number?: string;
  description?: string;
  note?: string;
}

export function buildNumberRequestMailUrl(form: NumberRequestForm = {}): string {
  const subject = encodeURIComponent('[몇번이야] 번호 추가 요청');
  const body = encodeURIComponent(
    [
      '추가해 주면 좋겠는 번호를 알려주세요.',
      '',
      '【 번호 이름 】',
      form.title?.trim() || '',
      '',
      '【 전화번호 】',
      form.number?.trim() || '',
      '',
      '【 설명·상황 】',
      form.description?.trim() || '',
      '',
      '【 기타 】',
      form.note?.trim() || '',
    ].join('\n'),
  );

  return `mailto:${NUMBER_REQUEST_EMAIL}?subject=${subject}&body=${body}`;
}

export function canSendNumberRequest(form: NumberRequestForm): boolean {
  return Boolean(form.title?.trim() || form.number?.trim() || form.description?.trim());
}
