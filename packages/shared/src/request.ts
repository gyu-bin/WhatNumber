export const NUMBER_REQUEST_EMAIL = 'rbqls6651@gmail.com';

export type ContactRequestKind = 'number-request' | 'feedback';

export interface NumberRequestForm {
  title?: string;
  number?: string;
  description?: string;
  note?: string;
}

export interface FeedbackForm {
  message?: string;
}

export interface ContactRequestPayload extends NumberRequestForm, FeedbackForm {
  kind: ContactRequestKind;
}

export function canSendNumberRequest(form: NumberRequestForm): boolean {
  return Boolean(form.title?.trim() || form.number?.trim() || form.description?.trim());
}

export function canSendFeedback(form: FeedbackForm): boolean {
  return Boolean(form.message?.trim());
}

/** @deprecated mailto 폴백용 — 서버 전송을 우선 사용하세요 */
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

/** @deprecated mailto 폴백용 — 서버 전송을 우선 사용하세요 */
export function buildFeedbackMailUrl(): string {
  const subject = encodeURIComponent('[몇번이야] 앱 의견');
  const body = encodeURIComponent(
    ['앱에 대한 의견이나 개선 아이디어를 적어 주세요.', '', ''].join('\n'),
  );
  return `mailto:${NUMBER_REQUEST_EMAIL}?subject=${subject}&body=${body}`;
}

export async function submitContactRequest(
  endpoint: string,
  payload: ContactRequestPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!response.ok) {
      return {
        ok: false,
        error: data?.error?.trim() || '전송에 실패했어요. 잠시 후 다시 시도해 주세요.',
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: '네트워크 오류예요. 연결을 확인해 주세요.' };
  }
}
