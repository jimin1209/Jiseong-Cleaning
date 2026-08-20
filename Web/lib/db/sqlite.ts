import Database from "better-sqlite3";
import { join } from "node:path";

let database: Database.Database | undefined;

export function getDatabase() {
  if (database) {
    return database;
  }

  database = new Database(join(process.cwd(), "data", "jiseong-cleaning.db"));
  database.pragma("foreign_keys = ON");
  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      base_price INTEGER NOT NULL CHECK (base_price >= 0),
      category TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS demo_partners (
      user_id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      partner_code_hash TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      company_name TEXT NOT NULL,
      partner_user_id TEXT REFERENCES demo_partners(user_id),
      status TEXT NOT NULL,
      estimated_amount INTEGER NOT NULL CHECK (estimated_amount >= 0),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      product_name TEXT NOT NULL,
      unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      line_amount INTEGER NOT NULL CHECK (line_amount >= 0)
    );

    CREATE TABLE IF NOT EXISTS order_status_histories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      from_status TEXT NOT NULL,
      to_status TEXT NOT NULL,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      reason_code TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_order_status_histories_order_id
      ON order_status_histories(order_id, created_at DESC);
  `);

  const partnerColumns = database
    .prepare("PRAGMA table_info(demo_partners)")
    .all() as Array<{ name: string }>;

  if (!partnerColumns.some((column) => column.name === "partner_code_hash")) {
    database.exec(
      "ALTER TABLE demo_partners ADD COLUMN partner_code_hash TEXT",
    );
  }

  const orderColumns = database
    .prepare("PRAGMA table_info(orders)")
    .all() as Array<{ name: string }>;

  if (!orderColumns.some((column) => column.name === "partner_user_id")) {
    database.exec(
      "ALTER TABLE orders ADD COLUMN partner_user_id TEXT REFERENCES demo_partners(user_id)",
    );
  }

  database.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_demo_partners_partner_code_hash
      ON demo_partners(partner_code_hash)
      WHERE partner_code_hash IS NOT NULL;

    CREATE INDEX IF NOT EXISTS idx_orders_partner_user_id
      ON orders(partner_user_id);
  `);

  const upsertProduct = database.prepare(`
    INSERT INTO products (name, base_price, category)
    VALUES (@name, @basePrice, @category)
    ON CONFLICT(name) DO UPDATE SET
      base_price = excluded.base_price,
      category = excluded.category
  `);
  database.transaction(() => {
    for (const product of sampleProducts) {
      upsertProduct.run(product);
    }
  })();

  return database;
}

const sampleProducts = [
  { name: "호텔 시트 (싱글)", basePrice: 800, category: "침구류" },
  { name: "베개 커버", basePrice: 500, category: "침구류" },
  { name: "대형 수건 (바스타월)", basePrice: 600, category: "수건류" },
  { name: "목욕 가운", basePrice: 1500, category: "가운·유니폼" },
  { name: "앞치마", basePrice: 900, category: "가운·유니폼" },
] as const;
