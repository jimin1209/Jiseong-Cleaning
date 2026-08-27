import type { InquiryInput } from "./schema";

/**
 * 견적 문의 저장소.
 *
 * 저장 위치가 배포 환경에 따라 다르다. 호출부(서버 액션·관리자 페이지)는
 * 이 파일의 두 함수만 쓰고 어디에 저장되는지는 모른다.
 *
 *   Netlify        → Netlify Blobs   (서버리스라 파일이 유지되지 않으므로)
 *   그 외(직접 실행) → SQLite 파일     (결정사항.md 의 SQLite 확정과 일치)
 *
 * ⚠️ 서버리스에서 SQLite 를 쓰면 접수가 조용히 사라진다. 함수 인스턴스가
 *    요청마다 새로 뜨고 파일 시스템이 초기화되기 때문이다. 그래서 Netlify 에서는
 *    같은 인터페이스로 Blobs 를 쓴다. Blobs 는 Netlify 내장이라 외부 서비스
 *    가입이나 연결 문자열이 필요 없다.
 */

export type Inquiry = InquiryInput & {
  id: number;
  createdAt: string;
};

/** Netlify 빌드·런타임에서 자동으로 설정되는 환경변수 */
const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_LOCAL);

const STORE_NAME = "jiseong-cleaning-inquiries";
/** 다음 번호를 담아두는 키. Blobs 에는 자동 증가가 없어 직접 센다 */
const COUNTER_KEY = "_counter";

/* ═══════════════ 공통 ═══════════════ */

function toInquiry(id: number, createdAt: string, input: InquiryInput): Inquiry {
  return {
    ...input,
    id,
    createdAt,
    consent: true,
  };
}

/** 목록 정렬·조회 키. 시각 역순으로 정렬되도록 0 을 채운 번호를 뒤에 붙인다 */
function blobKey(id: number, createdAt: string) {
  return `${createdAt}__${String(id).padStart(8, "0")}`;
}

/* ═══════════════ Netlify Blobs ═══════════════ */

async function blobStore() {
  const { getStore } = await import("@netlify/blobs");
  // 런타임이 컨텍스트를 못 넣어주는 경우를 대비한 수동 연결 경로 —
  // Netlify 환경변수에 NETLIFY_BLOBS_TOKEN(개인 액세스 토큰)을 넣으면 이 경로로 붙는다
  if (process.env.NETLIFY_BLOBS_TOKEN && process.env.SITE_ID) {
    return getStore({
      name: STORE_NAME,
      consistency: "strong",
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN,
    });
  }
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

async function saveToBlobs(input: InquiryInput): Promise<number> {
  const store = await blobStore();

  // 번호 발급. 동시 접수가 겹치면 번호가 밀릴 수 있으나
  // 접수 자체는 각자 다른 키로 저장되므로 유실되지 않는다.
  const raw = await store.get(COUNTER_KEY);
  const id = (raw ? Number(raw) : 0) + 1;
  await store.set(COUNTER_KEY, String(id));

  const createdAt = new Date().toISOString();
  await store.setJSON(blobKey(id, createdAt), toInquiry(id, createdAt, input));

  return id;
}

async function listFromBlobs(limit: number): Promise<Inquiry[]> {
  const store = await blobStore();
  const { blobs } = await store.list();

  const keys = blobs
    .map((b) => b.key)
    .filter((k) => k !== COUNTER_KEY)
    .sort()
    .reverse()
    .slice(0, limit);

  const rows = await Promise.all(
    keys.map((key) => store.get(key, { type: "json" }) as Promise<Inquiry | null>),
  );

  return rows.filter((r): r is Inquiry => r !== null);
}

async function countFromBlobs(): Promise<number> {
  const store = await blobStore();
  const raw = await store.get(COUNTER_KEY);
  return raw ? Number(raw) : 0;
}

/* ═══════════════ SQLite (직접 실행 환경) ═══════════════ */

type SqliteDb = import("node:sqlite").DatabaseSync;
let db: SqliteDb | null = null;

async function getDb(): Promise<SqliteDb> {
  if (db) return db;

  const { DatabaseSync } = await import("node:sqlite");
  const { mkdirSync } = await import("node:fs");
  const path = await import("node:path");

  const file =
    process.env.INQUIRY_DB_PATH ?? path.join(process.cwd(), ".data", "inquiries.db");
  mkdirSync(path.dirname(file), { recursive: true });

  db = new DatabaseSync(file);
  // industry·items·volume·cycle 컬럼은 폼에서 빠졌지만 기존 접수 데이터 보존을 위해
  // 스키마에 남긴다(마이그레이션 금지). 새 접수는 빈 문자열로 채운다.
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at   TEXT    NOT NULL,
      company      TEXT    NOT NULL,
      industry     TEXT    NOT NULL,
      contact_name TEXT    NOT NULL,
      phone        TEXT    NOT NULL,
      email        TEXT    NOT NULL DEFAULT '',
      region       TEXT    NOT NULL,
      items        TEXT    NOT NULL DEFAULT '',
      volume       TEXT    NOT NULL DEFAULT '',
      cycle        TEXT    NOT NULL DEFAULT '',
      message      TEXT    NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
      ON inquiries (created_at DESC);
  `);

  return db;
}

type Row = {
  id: number;
  created_at: string;
  company: string;
  industry: string;
  contact_name: string;
  phone: string;
  email: string;
  region: string;
  items: string;
  volume: string;
  cycle: string;
  message: string;
};

async function saveToSqlite(input: InquiryInput): Promise<number> {
  const conn = await getDb();
  const info = conn
    .prepare(
      `INSERT INTO inquiries
         (created_at, company, industry, contact_name, phone, email, region, items, volume, cycle, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      new Date().toISOString(),
      input.company,
      "", // industry — 폼에서 삭제된 컬럼, NOT NULL 이라 빈 값으로 채운다
      input.contactName,
      input.phone,
      input.email,
      input.region,
      "", // items
      "", // volume
      "", // cycle
      input.message,
    );

  return Number(info.lastInsertRowid);
}

async function listFromSqlite(limit: number): Promise<Inquiry[]> {
  const conn = await getDb();
  const rows = conn
    .prepare(
      `SELECT * FROM inquiries ORDER BY datetime(created_at) DESC, id DESC LIMIT ?`,
    )
    .all(limit) as unknown as Row[];

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    company: r.company,
    contactName: r.contact_name,
    phone: r.phone,
    email: r.email,
    region: r.region,
    message: r.message,
    consent: true,
  }));
}

async function countFromSqlite(): Promise<number> {
  const conn = await getDb();
  const row = conn.prepare(`SELECT COUNT(*) AS n FROM inquiries`).get() as
    | { n: number }
    | undefined;
  return row?.n ?? 0;
}

/* ═══════════════ 공개 인터페이스 ═══════════════ */

export async function saveInquiry(input: InquiryInput): Promise<number> {
  return onNetlify ? saveToBlobs(input) : saveToSqlite(input);
}

export async function listInquiries(limit = 200): Promise<Inquiry[]> {
  return onNetlify ? listFromBlobs(limit) : listFromSqlite(limit);
}

export async function countInquiries(): Promise<number> {
  return onNetlify ? countFromBlobs() : countFromSqlite();
}

/** 관리자 화면에 어디에 저장되는지 알려준다 */
export const storageBackend = onNetlify ? "Netlify Blobs" : "SQLite 파일";
