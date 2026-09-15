declare const process: { env: Record<string, string | undefined> };

const NEMC_LOCATION_URL =
  'https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytLcinfoInqire';
const NEMC_BEDS_URL =
  'https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire';
const UPSTREAM_TIMEOUT_MS = 7_000;
const MAX_RESULTS = 20;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function rateLimitAllow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || entry.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

type Coordinate = {
  latitude: number;
  longitude: number;
};

type EmergencyRoom = {
  id: string;
  name: string;
  address: string;
  location: Coordinate;
  /** 위치 조회 응답의 dutyTel1(기관 대표전화)입니다. */
  phone?: string;
  /** 실시간 가용 응급실 일반병상(hvec). 음수는 과밀을 의미합니다. */
  availableBeds?: number;
  distanceKm: number;
};

type Region = {
  stage1: string;
  stage2: string;
};

class UpstreamError extends Error {
  constructor(
    message: string,
    readonly kind: 'timeout' | 'network' | 'upstream-http' | 'invalid-xml' | 'api-response',
    readonly upstreamStatus?: number,
  ) {
    super(message);
  }
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}

function readCoordinate(value: string | null, min: number, max: number): number | undefined {
  if (value === null || value.trim() === '') return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : undefined;
}

function decodeXmlText(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function firstTag(xml: string, tag: string): string | undefined {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXmlText(match[1]) : undefined;
}

function allTags(xml: string, tag: string): string[] {
  const matches = xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi'));
  return [...matches].map((match) => match[1]);
}

function numberTag(xml: string, tag: string): number | undefined {
  const value = firstTag(xml, tag);
  if (value === undefined || value === '') return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function distanceInKm(from: Coordinate, to: Coordinate): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 병상 API용 STAGE1/STAGE2 후보를 만듭니다.
 * 도 단위는 시군구 API가 `성남시`처럼 시 단위를 쓰는 경우가 많아 시 단위를 우선하고,
 * `성남시분당구` / `성남시 분당구` 형태도 이어서 시도합니다.
 */
function regionCandidates(address: string): Region[] {
  const normalized = address.replace(/\s+/g, ' ').trim();
  const metro = normalized.match(
    /^(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|제주특별자치도|강원특별자치도|전북특별자치도)\s+(\S+)/,
  );
  if (metro) {
    return [{ stage1: metro[1], stage2: metro[2].replace(/,$/, '') }];
  }

  const province = normalized.match(
    /^(경기도|충청북도|충청남도|전라남도|경상북도|경상남도)\s+(\S+)/,
  );
  if (!province) return [];

  const stage1 = province[1];
  const second = province[2].replace(/,$/, '');
  const district = normalized.match(
    /^(?:경기도|충청북도|충청남도|전라남도|경상북도|경상남도)\s+(\S+시)\s+(\S+구)/,
  );

  const candidates: Region[] = [];
  const push = (stage2: string) => {
    if (!candidates.some((region) => region.stage2 === stage2)) {
      candidates.push({ stage1, stage2 });
    }
  };

  if (district) {
    push(district[1]); // 성남시
    push(`${district[1]}${district[2]}`); // 성남시분당구
    push(`${district[1]} ${district[2]}`); // 성남시 분당구
  } else {
    push(second);
  }

  return candidates;
}

function parseLocationResponse(xml: string, origin: Coordinate): EmergencyRoom[] {
  const resultCode = firstTag(xml, 'resultCode');
  if (resultCode !== '00') {
    throw new UpstreamError('The emergency medical API returned an error response.', 'api-response');
  }

  return allTags(xml, 'item')
    .map((item): EmergencyRoom | undefined => {
      const id = firstTag(item, 'hpid');
      const name = firstTag(item, 'dutyName');
      const address = firstTag(item, 'dutyAddr');
      const latitude = numberTag(item, 'latitude');
      const longitude = numberTag(item, 'longitude');

      if (
        !id ||
        !name ||
        !address ||
        latitude === undefined ||
        longitude === undefined ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return undefined;
      }

      const location = { latitude, longitude };
      const phone = firstTag(item, 'dutyTel1');
      return {
        id,
        name,
        address,
        location,
        ...(phone ? { phone } : {}),
        distanceKm: distanceInKm(origin, location),
      };
    })
    .filter((room): room is EmergencyRoom => room !== undefined)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, MAX_RESULTS);
}

function parseBedsResponse(xml: string): Map<string, number> {
  const beds = new Map<string, number>();
  const resultCode = firstTag(xml, 'resultCode');
  if (resultCode !== '00') return beds;

  for (const item of allTags(xml, 'item')) {
    const id = firstTag(item, 'hpid');
    const hvec = numberTag(item, 'hvec');
    if (!id || hvec === undefined) continue;
    beds.set(id, hvec);
  }
  return beds;
}

async function fetchXml(url: URL, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, {
    headers: { Accept: 'application/xml, text/xml;q=0.9, */*;q=0.1' },
    signal,
  });

  if (!response.ok) {
    throw new UpstreamError(
      'The emergency medical API returned a non-success status.',
      'upstream-http',
      response.status,
    );
  }

  const xml = await response.text();
  if (!xml.trimStart().startsWith('<')) {
    throw new UpstreamError('The emergency medical API returned a non-XML response.', 'invalid-xml');
  }
  return xml;
}

async function requestLocations(origin: Coordinate, serviceKey: string): Promise<EmergencyRoom[]> {
  const url = new URL(NEMC_LOCATION_URL);
  // The Vercel secret must be the public-data portal's Decoding key. URLSearchParams encodes it once.
  url.searchParams.set('serviceKey', serviceKey);
  url.searchParams.set('WGS84_LON', String(origin.longitude));
  url.searchParams.set('WGS84_LAT', String(origin.latitude));
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', String(MAX_RESULTS));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const xml = await fetchXml(url, controller.signal);
    return parseLocationResponse(xml, origin);
  } catch (error) {
    if (error instanceof UpstreamError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new UpstreamError('The emergency medical API request timed out.', 'timeout');
    }
    throw new UpstreamError('The emergency medical API request failed.', 'network');
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchBedsForRegion(
  region: Region,
  serviceKey: string,
): Promise<Map<string, number>> {
  const url = new URL(NEMC_BEDS_URL);
  url.searchParams.set('serviceKey', serviceKey);
  url.searchParams.set('STAGE1', region.stage1);
  url.searchParams.set('STAGE2', region.stage2);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '100');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const xml = await fetchXml(url, controller.signal);
    return parseBedsResponse(xml);
  } catch (error) {
    console.error('Emergency bed API request failed', {
      stage1: region.stage1,
      stage2: region.stage2,
      kind:
        error instanceof UpstreamError
          ? error.kind
          : error instanceof DOMException && error.name === 'AbortError'
            ? 'timeout'
            : 'unexpected',
    });
    return new Map();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchBedsForRegions(
  regions: Region[],
  serviceKey: string,
): Promise<Map<string, number>> {
  const merged = new Map<string, number>();
  await Promise.all(
    regions.map(async (region) => {
      const beds = await fetchBedsForRegion(region, serviceKey);
      for (const [id, count] of beds) merged.set(id, count);
    }),
  );
  return merged;
}

/**
 * 병상 조회 실패는 목록 전체를 막지 않습니다.
 * 도 지역은 시 단위 STAGE2를 먼저 병렬 조회하고, 매칭이 없으면 구 단위 후보를 이어서 시도합니다.
 */
async function requestBedsByAddresses(
  addresses: string[],
  serviceKey: string,
): Promise<Map<string, number>> {
  const primary = new Map<string, Region>();
  const fallback = new Map<string, Region>();

  for (const address of addresses) {
    const candidates = regionCandidates(address);
    if (candidates.length === 0) continue;
    primary.set(`${candidates[0].stage1}|${candidates[0].stage2}`, candidates[0]);
    for (const region of candidates.slice(1)) {
      fallback.set(`${region.stage1}|${region.stage2}`, region);
    }
  }

  let merged = await fetchBedsForRegions([...primary.values()], serviceKey);

  if (merged.size === 0 && fallback.size > 0) {
    merged = await fetchBedsForRegions([...fallback.values()], serviceKey);
  }

  console.info('Emergency bed merge', {
    primaryRegions: primary.size,
    fallbackRegions: fallback.size,
    bedsMatched: merged.size,
  });

  return merged;
}

function attachAvailableBeds(rooms: EmergencyRoom[], beds: Map<string, number>): EmergencyRoom[] {
  return rooms.map((room) => {
    const availableBeds = beds.get(room.id);
    return availableBeds === undefined ? room : { ...room, availableBeds };
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return new Response(null, { status: 405, headers: { Allow: 'GET' } });
    }

    if (!rateLimitAllow(`emergency:${clientKey(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return json({ error: '요청이 많아요. 잠시 후 다시 시도해 주세요.' }, 429);
    }

    const url = new URL(request.url);
    const latitude = readCoordinate(url.searchParams.get('latitude'), -90, 90);
    const longitude = readCoordinate(url.searchParams.get('longitude'), -180, 180);
    if (latitude === undefined || longitude === undefined) {
      return json({ error: 'latitude와 longitude를 올바른 좌표값으로 보내주세요.' }, 400);
    }

    const serviceKey = process.env.NEMC_EMERGENCY_API_KEY?.trim();
    if (!serviceKey) {
      return json({ error: '응급실 정보 서비스를 일시적으로 사용할 수 없어요.' }, 503);
    }

    try {
      const rooms = await requestLocations({ latitude, longitude }, serviceKey);
      const beds = await requestBedsByAddresses(
        rooms.map((room) => room.address),
        serviceKey,
      );
      return json({
        rooms: attachAvailableBeds(rooms, beds),
        fetchedAt: new Date().toISOString(),
      });
    } catch (error) {
      // Do not expose the upstream XML body, status details, request URL, or ServiceKey.
      console.error(
        'Emergency medical API request failed',
        error instanceof UpstreamError
          ? { kind: error.kind, ...(error.upstreamStatus ? { upstreamStatus: error.upstreamStatus } : {}) }
          : { kind: 'unexpected' },
      );
      return json({ error: '응급실 정보를 지금 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }, 502);
    }
  },
};
