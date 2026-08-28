/**
 * 사이트에 실제로 반영된 문구 (편집자 게시본).
 *
 * copy.ts 가 "코드 원문"이라면 여기는 "지금 사이트에 떠 있는 문구"다.
 * /admin/edit 에서 편집자가 「사이트에 반영」을 누르면 키 → 문구가 여기 저장되고,
 * 루트 레이아웃이 이 맵을 읽어 copy.ts 위에 덮어쓴다. 개발자가 코드를 고치지
 * 않아도 편집자가 화면 문구를 바꿀 수 있는 이유가 이 파일이다.
 *
 * 원문(copy.ts)은 지우지 않는다 — 저장된 값을 지우면 언제든 코드 원문으로 돌아간다.
 * 그래서 「원문으로 되돌리기」가 항상 가능하고, 저장소가 비어도 사이트는 정상이다.
 *
 * 저장 위치는 inquiries.ts · copy-drafts.ts 와 같은 이중화 패턴을 따른다:
 *   Netlify        → Netlify Blobs
 *   그 외(직접 실행) → SQLite 파일 (.data/copy-live.db)
 */

export type LiveCopy = {
  /** 키 → 반영된 문구. 비어 있으면 사이트는 copy.ts 원문 그대로다 */
  overrides: Record<string, string>;
  /** 마지막 반영 시각(ISO). 한 번도 반영한 적이 없으면 null */
  updatedAt: string | null;
};

export const EMPTY_LIVE_COPY: LiveCopy = { overrides: {}, updatedAt: null };

/** Netlify 빌드·런타임에서 자동으로 설정되는 환경변수 */
const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_LOCAL);
/**
 * Netlify 런타임에 NETLIFY 변수가 없어 SQLite 분기로 새는 사고가 있었다
 * (copy-drafts.ts 주석 참고). 수동 Blobs 자격증명이 있으면 무조건 Blobs 를 쓴다.
 */
const hasManualBlobs = Boolean(
  process.env.NETLIFY_BLOBS_TOKEN &&
    (process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID),
);
const useBlobs = onNetlify || hasManualBlobs;

const STORE_NAME = "jiseong-cleaning-copy-live";
/** 게시본은 문서 한 장이라 키가 하나뿐이다 */
const BLOB_KEY = "live";

/* ═══════════════ Netlify Blobs ═══════════════ */

async function blobStore() {
  const { getStore } = await import("@netlify/blobs");
  const siteID = process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID;
  if (process.env.NETLIFY_BLOBS_TOKEN && siteID) {
    return getStore({
      name: STORE_NAME,
      consistency: "strong",
      siteID,
      token: process.env.NETLIFY_BLOBS_TOKEN,
    });
  }
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

async function readFromBlobs(): Promise<LiveCopy> {
  const store = await blobStore();
  const doc = (await store.get(BLOB_KEY, { type: "json" })) as LiveCopy | null;
  if (!doc || typeof doc.overrides !== "object" || doc.overrides === null) {
    return EMPTY_LIVE_COPY;
  }
  return { overrides: doc.overrides, updatedAt: doc.updatedAt ?? null };
}

async function writeToBlobs(next: LiveCopy): Promise<void> {
  const store = await blobStore();
  await store.setJSON(BLOB_KEY, next);
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
    process.env.COPY_LIVE_DB_PATH ??
    path.join(process.cwd(), ".data", "copy-live.db");
  mkdirSync(path.dirname(file), { recursive: true });

  db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS copy_live (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  return db;
}

async function readFromSqlite(): Promise<LiveCopy> {
  const conn = await getDb();
  const rows = conn
    .prepare(`SELECT key, value, updated_at FROM copy_live`)
    .all() as unknown as { key: string; value: string; updated_at: string }[];

  const overrides: Record<string, string> = {};
  let updatedAt: string | null = null;
  for (const r of rows) {
    overrides[r.key] = r.value;
    if (!updatedAt || r.updated_at > updatedAt) updatedAt = r.updated_at;
  }
  return { overrides, updatedAt };
}

async function writeToSqlite(next: LiveCopy): Promise<void> {
  const conn = await getDb();
  const now = next.updatedAt ?? new Date().toISOString();
  // 게시본은 통째로 갈아끼운다 — 지운 키가 남아 되돌리기가 먹지 않는 사고를 막는다
  conn.exec(`DELETE FROM copy_live`);
  const insert = conn.prepare(
    `INSERT INTO copy_live (key, value, updated_at) VALUES (?, ?, ?)`,
  );
  for (const [key, value] of Object.entries(next.overrides)) {
    insert.run(key, value, now);
  }
}

/* ═══════════════ 공개 인터페이스 ═══════════════ */

/** 게시본을 읽는다. 저장소 장애는 그대로 던진다(관리자 화면이 알려야 하므로) */
export async function readLiveCopy(): Promise<LiveCopy> {
  return useBlobs ? readFromBlobs() : readFromSqlite();
}

/**
 * 공개 화면용 — 저장소가 죽어도 사이트는 떠야 한다.
 * 실패하면 빈 게시본을 돌려주므로 화면은 copy.ts 원문으로 정상 렌더된다.
 */
export async function readLiveCopySafe(): Promise<LiveCopy> {
  try {
    return await readLiveCopy();
  } catch (err) {
    console.error("[copy-live] 게시본 조회 실패 — 원문으로 렌더합니다", err);
    return EMPTY_LIVE_COPY;
  }
}

/**
 * 편집 결과를 사이트에 반영한다.
 *
 * `entries` 는 덮어쓸 키 → 문구. `removeKeys` 에 담긴 키는 게시본에서 빼서
 * copy.ts 원문으로 되돌린다. 둘 다 기존 게시본 위에 병합된다.
 */
export async function publishLiveCopy(
  entries: Record<string, string>,
  removeKeys: string[] = [],
): Promise<LiveCopy> {
  const current = await readLiveCopy();
  const overrides = { ...current.overrides, ...entries };
  for (const key of removeKeys) delete overrides[key];

  const next: LiveCopy = { overrides, updatedAt: new Date().toISOString() };
  await (useBlobs ? writeToBlobs(next) : writeToSqlite(next));
  return next;
}

/** 게시본 전체 삭제 — 사이트 문구가 코드 원문으로 완전히 돌아간다 */
export async function clearLiveCopy(): Promise<void> {
  const next: LiveCopy = { overrides: {}, updatedAt: new Date().toISOString() };
  await (useBlobs ? writeToBlobs(next) : writeToSqlite(next));
}

/** 관리자 화면에 어디에 저장되는지 알려준다 */
export const copyLiveBackend = useBlobs ? "Netlify Blobs" : "SQLite 파일";
