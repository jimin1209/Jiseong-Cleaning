/**
 * 문구 수정안("안" 세트) 저장소 (명세 9-2 · 관리자 인라인 편집).
 *
 * 편집 화면(/admin/edit)에서 여러 텍스트를 고친 뒤 하나의 "안"으로 저장하고,
 * 제안 게시판(/admin/proposals)이 목록·상세·상태를 보여준다.
 * 즉시 반영 금지 원칙(F2) — 여기 저장된 수정안은 화면에 자동 반영되지 않고,
 * 회의에서 채택된 뒤 개발자가 copy.ts(또는 원본 파일)에 손으로 옮긴다.
 *
 * 저장 위치는 inquiries.ts 와 같은 이중화 패턴을 따른다:
 *   Netlify        → Netlify Blobs
 *   그 외(직접 실행) → SQLite 파일 (.data/copy-drafts.db — 문의 DB 와 파일 분리)
 */

export type CopyEdit = {
  key: string;
  /** 저장 시점의 원문 — 이후 copy.ts 가 바뀌어도 제안 당시 기준을 남긴다 */
  original: string;
  proposed: string;
};

/** 반영은 개발자가 수동 반영을 마친 뒤 붙이는 표시일 뿐, 자동 반영 기능은 없다 */
export type CopyDraftStatus = "제안" | "채택" | "반영";

export type CopyDraft = {
  id: number;
  title: string;
  /** 편집한 페이지 경로 키(home·about·services·quote) — 공용 컴포넌트 키도 함께 담길 수 있다 */
  page: string;
  status: CopyDraftStatus;
  createdAt: string;
  updatedAt: string;
  edits: CopyEdit[];
};

export type CopyDraftInput = Pick<CopyDraft, "title" | "page" | "edits">;

/** Netlify 빌드·런타임에서 자동으로 설정되는 환경변수 */
const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_LOCAL);
/**
 * Netlify 런타임(Next.js 서버 핸들러)에는 NETLIFY 변수가 없을 수 있다 —
 * 실측(2026-08-28): 프로덕션이 SQLite 분기로 빠져 읽기 전용 FS 에서 실패했다.
 * 수동 Blobs 자격증명(NETLIFY_BLOBS_TOKEN + SITE_ID)이 있으면 무조건 Blobs 를 쓴다.
 */
const hasManualBlobs = Boolean(
  process.env.NETLIFY_BLOBS_TOKEN &&
    (process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID),
);
const useBlobs = onNetlify || hasManualBlobs;

const STORE_NAME = "jiseong-cleaning-copy-drafts";
/** 다음 번호를 담아두는 키. Blobs 에는 자동 증가가 없어 직접 센다 */
const COUNTER_KEY = "_counter";

/* ═══════════════ 공통 ═══════════════ */

/** 안은 상태·제목이 갱신되므로 id 만으로 키를 만든다(시각 정렬은 id 역순으로 충분) */
function blobKey(id: number) {
  return String(id).padStart(8, "0");
}

/* ═══════════════ Netlify Blobs ═══════════════ */

async function blobStore() {
  const { getStore } = await import("@netlify/blobs");
  // 런타임이 컨텍스트를 안 넣어줄 때의 수동 연결 (inquiries.ts 와 동일 — MissingBlobsEnvironmentError 대응)
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

async function saveToBlobs(input: CopyDraftInput): Promise<number> {
  const store = await blobStore();

  const raw = await store.get(COUNTER_KEY);
  const id = (raw ? Number(raw) : 0) + 1;
  await store.set(COUNTER_KEY, String(id));

  const now = new Date().toISOString();
  const draft: CopyDraft = {
    id,
    createdAt: now,
    updatedAt: now,
    status: "제안",
    ...input,
  };
  await store.setJSON(blobKey(id), draft);

  return id;
}

async function getFromBlobs(id: number): Promise<CopyDraft | null> {
  const store = await blobStore();
  return (await store.get(blobKey(id), { type: "json" })) as CopyDraft | null;
}

async function putToBlobs(draft: CopyDraft): Promise<void> {
  const store = await blobStore();
  await store.setJSON(blobKey(draft.id), draft);
}

async function listFromBlobs(limit: number): Promise<CopyDraft[]> {
  const store = await blobStore();
  const { blobs } = await store.list();

  const keys = blobs
    .map((b) => b.key)
    .filter((k) => k !== COUNTER_KEY)
    .sort()
    .reverse()
    .slice(0, limit);

  const rows = await Promise.all(
    keys.map((key) => store.get(key, { type: "json" }) as Promise<CopyDraft | null>),
  );

  return rows.filter((r): r is CopyDraft => r !== null);
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
    process.env.COPY_DRAFT_DB_PATH ??
    path.join(process.cwd(), ".data", "copy-drafts.db");
  mkdirSync(path.dirname(file), { recursive: true });

  db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS copy_drafts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      title      TEXT NOT NULL,
      page       TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT '제안',
      edits      TEXT NOT NULL
    );
  `);

  return db;
}

type Row = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  page: string;
  status: string;
  edits: string;
};

function fromRow(r: Row): CopyDraft {
  return {
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    title: r.title,
    page: r.page,
    status: r.status as CopyDraftStatus,
    edits: JSON.parse(r.edits) as CopyEdit[],
  };
}

async function saveToSqlite(input: CopyDraftInput): Promise<number> {
  const conn = await getDb();
  const now = new Date().toISOString();
  const info = conn
    .prepare(
      `INSERT INTO copy_drafts (created_at, updated_at, title, page, status, edits)
       VALUES (?, ?, ?, ?, '제안', ?)`,
    )
    .run(now, now, input.title, input.page, JSON.stringify(input.edits));

  return Number(info.lastInsertRowid);
}

async function getFromSqlite(id: number): Promise<CopyDraft | null> {
  const conn = await getDb();
  const row = conn.prepare(`SELECT * FROM copy_drafts WHERE id = ?`).get(id) as
    | Row
    | undefined;
  return row ? fromRow(row) : null;
}

async function putToSqlite(draft: CopyDraft): Promise<void> {
  const conn = await getDb();
  conn
    .prepare(
      `UPDATE copy_drafts
         SET updated_at = ?, title = ?, page = ?, status = ?, edits = ?
       WHERE id = ?`,
    )
    .run(
      draft.updatedAt,
      draft.title,
      draft.page,
      draft.status,
      JSON.stringify(draft.edits),
      draft.id,
    );
}

async function listFromSqlite(limit: number): Promise<CopyDraft[]> {
  const conn = await getDb();
  const rows = conn
    .prepare(`SELECT * FROM copy_drafts ORDER BY id DESC LIMIT ?`)
    .all(limit) as unknown as Row[];
  return rows.map(fromRow);
}

async function countFromSqlite(): Promise<number> {
  const conn = await getDb();
  const row = conn.prepare(`SELECT COUNT(*) AS n FROM copy_drafts`).get() as
    | { n: number }
    | undefined;
  return row?.n ?? 0;
}

/* ═══════════════ 공개 인터페이스 ═══════════════ */

export async function saveCopyDraft(input: CopyDraftInput): Promise<number> {
  return useBlobs ? saveToBlobs(input) : saveToSqlite(input);
}

export async function getCopyDraft(id: number): Promise<CopyDraft | null> {
  return useBlobs ? getFromBlobs(id) : getFromSqlite(id);
}

/** 기존 안을 이어서 수정("덮어쓰기 저장") — 상태는 유지하고 내용·시각만 갱신 */
export async function updateCopyDraft(
  id: number,
  input: CopyDraftInput,
): Promise<boolean> {
  const draft = await getCopyDraft(id);
  if (!draft) return false;

  const next: CopyDraft = {
    ...draft,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await (useBlobs ? putToBlobs(next) : putToSqlite(next));
  return true;
}

export async function setCopyDraftStatus(
  id: number,
  status: CopyDraftStatus,
): Promise<boolean> {
  const draft = await getCopyDraft(id);
  if (!draft) return false;

  await (useBlobs
    ? putToBlobs({ ...draft, status })
    : putToSqlite({ ...draft, status }));
  return true;
}

export async function listCopyDrafts(limit = 200): Promise<CopyDraft[]> {
  return useBlobs ? listFromBlobs(limit) : listFromSqlite(limit);
}

/** 지금까지 발급된 안 번호 — 새 안의 기본 제목("N안") 번호를 만드는 데 쓴다 */
export async function countCopyDrafts(): Promise<number> {
  return useBlobs ? countFromBlobs() : countFromSqlite();
}

/** 관리자 화면에 어디에 저장되는지 알려준다 */
export const copyDraftBackend = useBlobs ? "Netlify Blobs" : "SQLite 파일";
