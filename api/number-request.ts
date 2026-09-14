declare const process: { env: Record<string, string | undefined> };

const RESEND_API_URL = 'https://api.resend.com/emails';
const MAX_FIELD_LENGTH = 500;
const MAX_BODY_LENGTH = 2_000;

type ContactKind = 'number-request' | 'feedback';

type ContactPayload = {
  kind?: ContactKind;
  title?: string;
  number?: string;
  description?: string;
  note?: string;
  message?: string;
};

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(),
    },
  });
}

function clip(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function isNonEmpty(value: string): boolean {
  return value.length > 0;
}

async function readPayload(request: Request): Promise<ContactPayload | null> {
  try {
    const data = (await request.json()) as ContactPayload;
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch {
    return null;
  }
}

function buildEmail(payload: ContactPayload): { subject: string; text: string } | null {
  const kind: ContactKind = payload.kind === 'feedback' ? 'feedback' : 'number-request';
  const title = clip(payload.title, MAX_FIELD_LENGTH);
  const number = clip(payload.number, MAX_FIELD_LENGTH);
  const description = clip(payload.description, MAX_BODY_LENGTH);
  const note = clip(payload.note, MAX_BODY_LENGTH);
  const message = clip(payload.message, MAX_BODY_LENGTH);

  if (kind === 'feedback') {
    const body = message || description;
    if (!isNonEmpty(body)) return null;
    return {
      subject: '[몇번이야] 앱 의견',
      text: ['앱 의견이 도착했어요.', '', body, '', `수신: ${new Date().toISOString()}`].join('\n'),
    };
  }

  if (![title, number, description].some(isNonEmpty)) return null;

  return {
    subject: '[몇번이야] 번호 추가 요청',
    text: [
      '번호 추가 요청이 도착했어요.',
      '',
      '【 번호 이름 】',
      title || '(없음)',
      '',
      '【 전화번호 】',
      number || '(없음)',
      '',
      '【 설명·상황 】',
      description || '(없음)',
      '',
      '【 기타 】',
      note || '(없음)',
      '',
      `수신: ${new Date().toISOString()}`,
    ].join('\n'),
  };
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return new Response(null, {
        status: 405,
        headers: { Allow: 'POST, OPTIONS', ...corsHeaders() },
      });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      return json({ error: '요청 전송 서비스를 일시적으로 사용할 수 없어요.' }, 503);
    }

    const to =
      process.env.NUMBER_REQUEST_TO_EMAIL?.trim() || 'rbqls6651@gmail.com';
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() || '몇번이야 <onboarding@resend.dev>';

    const payload = await readPayload(request);
    if (!payload) {
      return json({ error: '요청 형식이 올바르지 않아요.' }, 400);
    }

    const email = buildEmail(payload);
    if (!email) {
      return json({ error: '내용을 하나 이상 입력해 주세요.' }, 400);
    }

    try {
      const resendResponse = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: email.subject,
          text: email.text,
        }),
      });

      if (!resendResponse.ok) {
        const detail = await resendResponse.text().catch(() => '');
        console.error('Resend error', resendResponse.status, detail.slice(0, 300));
        return json({ error: '메일 전송에 실패했어요. 잠시 후 다시 시도해 주세요.' }, 502);
      }

      return json({ ok: true });
    } catch (error) {
      console.error('Number request send failed', error);
      return json({ error: '메일 전송에 실패했어요. 잠시 후 다시 시도해 주세요.' }, 502);
    }
  },
};
