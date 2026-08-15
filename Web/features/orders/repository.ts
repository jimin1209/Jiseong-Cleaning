import { randomBytes } from "node:crypto";
import type Database from "better-sqlite3";
import { getDatabase } from "@/lib/db/sqlite";

export type Product = {
  id: number;
  name: string;
  basePrice: number;
  category: string;
};

export type OrderItemInput = { productId: number; quantity: number };

type ProductRow = {
  id: number;
  name: string;
  base_price: number;
  category: string;
};

export function listProducts(): Product[] {
  const rows = getDatabase()
    .prepare("SELECT id, name, base_price, category FROM products ORDER BY id")
    .all() as ProductRow[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    basePrice: row.base_price,
    category: row.category,
  }));
}

export function calculateOrder(items: OrderItemInput[]) {
  return calculateOrderWithDatabase(getDatabase(), items);
}

export function createOrder(companyName: string, items: OrderItemInput[]) {
  const database = getDatabase();

  return database.transaction(() => {
    const calculation = calculateOrderWithDatabase(database, items);
    if (calculation.lines.length === 0) {
      throw new Error("한 개 이상의 품목을 선택해 주세요.");
    }

    const createdAt = new Date().toISOString();
    const insertOrder = database.prepare(`
      INSERT INTO orders (
        order_number, company_name, status, estimated_amount, created_at
      ) VALUES (?, ?, ?, ?, ?)
    `);
    let orderNumber = "";
    let orderId: number | bigint | undefined;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      orderNumber = createOrderNumber();
      try {
        orderId = insertOrder.run(
          orderNumber,
          companyName,
          "접수",
          calculation.amount,
          createdAt,
        ).lastInsertRowid;
        break;
      } catch (error) {
        if (!isUniqueConstraintError(error) || attempt === 4) {
          throw error;
        }
      }
    }

    if (orderId === undefined) {
      throw new Error("주문번호를 생성하지 못했습니다.");
    }

    const insertItem = database.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_name, unit_price, quantity, line_amount
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const line of calculation.lines) {
      insertItem.run(
        orderId,
        line.productId,
        line.productName,
        line.unitPrice,
        line.quantity,
        line.lineAmount,
      );
    }

    return { orderNumber, estimatedAmount: calculation.amount };
  })();
}

function calculateOrderWithDatabase(
  database: Database.Database,
  items: OrderItemInput[],
) {
  validateItems(items);
  const productStatement = database.prepare(
    "SELECT id, name, base_price, category FROM products WHERE id = ?",
  );
  const lines = items.map((item) => {
    const product = productStatement.get(item.productId) as ProductRow | undefined;
    if (!product) {
      throw new Error("존재하지 않는 품목이 포함되어 있습니다.");
    }
    return {
      productId: product.id,
      productName: product.name,
      unitPrice: product.base_price,
      quantity: item.quantity,
      lineAmount: product.base_price * item.quantity,
    };
  });
  return {
    amount: lines.reduce((sum, line) => sum + line.lineAmount, 0),
    lines,
  };
}

function validateItems(items: OrderItemInput[]) {
  if (!Array.isArray(items)) {
    throw new Error("품목 목록 형식이 올바르지 않습니다.");
  }
  const productIds = new Set<number>();
  for (const item of items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new Error("올바르지 않은 품목 식별자가 포함되어 있습니다.");
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10000) {
      throw new Error("품목 수량은 1장 이상 10,000장 이하이어야 합니다.");
    }
    if (productIds.has(item.productId)) {
      throw new Error("같은 품목이 중복으로 포함되어 있습니다.");
    }
    productIds.add(item.productId);
  }
}

function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `JC-${date}-${randomBytes(6).toString("hex").toUpperCase()}`;
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === "SQLITE_CONSTRAINT_UNIQUE"
  );
}
