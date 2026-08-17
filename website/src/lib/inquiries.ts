import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { InquiryInput } from "./schema";

/**
 * 견적 문의 저장소.
 *
 * SQLite를 쓰는 이유: 결정사항.md 에서 데모 스택이 **Next.js + SQLite** 로 확정돼 있고,
 * 문의 접수는 외부 서비스 없이도 유실되지 않아야 한다.
 * node 22+ 내장 `node:sqlite` 를 써서 네이티브 빌드 의존성이 없다.
 *
 * ⚠️ 서버리스(Vercel·Netlify Functions)에 올리면 파일 시스템이 요청마다 초기화되므로
 *    이 저장소는 유지되지 않는다. 그 환경으로 배포할 때는 아래 두 함수의 구현만
 *    PostgreSQL(설계서 2장 권장안)로 갈아끼우면 되고, 호출부는 바뀌지 않는다.
 *    그 사이에도 문의가 유실되지 않도록 메일 발송을 함께 붙여 두었다(lib/mail.ts).
 */

export type Inquiry = InquiryInput & {
  id: number;
  createdAt: string;
  itemsText: string;
};

const DB_PATH =
  process.env.INQUIRY_DB_PATH ?? path.join(process.cwd(), ".data", "inquiries.db");

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;

  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);

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

export function saveInquiry(input: InquiryInput): number {
  const stmt = getDb().prepare(`
    INSERT INTO inquiries
      (created_at, company, industry, contact_name, phone, email, region, items, volume, cycle, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    new Date().toISOString(),
    input.company,
    input.industry,
    input.contactName,
    input.phone,
    input.email,
    input.region,
    input.items.join(", "),
    input.volume,
    input.cycle,
    input.message,
  );

  return Number(info.lastInsertRowid);
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

export function listInquiries(limit = 200): Inquiry[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM inquiries ORDER BY datetime(created_at) DESC, id DESC LIMIT ?`,
    )
    .all(limit) as unknown as Row[];

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    company: r.company,
    industry: r.industry as InquiryInput["industry"],
    contactName: r.contact_name,
    phone: r.phone,
    email: r.email,
    region: r.region,
    items: r.items ? (r.items.split(", ") as InquiryInput["items"]) : [],
    itemsText: r.items,
    volume: r.volume,
    cycle: r.cycle as InquiryInput["cycle"],
    message: r.message,
    consent: true,
  }));
}

export function countInquiries(): number {
  const row = getDb().prepare(`SELECT COUNT(*) AS n FROM inquiries`).get() as
    | { n: number }
    | undefined;
  return row?.n ?? 0;
}
