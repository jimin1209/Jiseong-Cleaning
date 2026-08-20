import { randomBytes } from "node:crypto";
import type Database from "better-sqlite3";
import { getDatabase } from "@/lib/db/sqlite";
import { normalizeOrderStatus, orderStatusSteps } from "./status";

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

type OrderRow = {
  order_number: string;
  company_name: string;
  status: string;
  estimated_amount: number;
  created_at: string;
};

type OrderSummaryRow = OrderRow & { item_summary: string };

type PartnerOrderRow = Omit<OrderRow, "company_name">;

type PartnerOrderSummaryRow = PartnerOrderRow & { item_summary: string };

type OrderItemRow = {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_amount: number;
};

type OrderHistoryRow = {
  from_status: string;
  to_status: string;
  actor_type: string;
  actor_id: string;
  created_at: string;
};

export type AdminOrderSummary = {
  orderNumber: string;
  companyName: string;
  itemSummary: string;
  estimatedAmount: number;
  status: string;
  createdAt: string;
};

export type AdminOrderDetail = Omit<AdminOrderSummary, "itemSummary"> & {
  items: Array<{
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineAmount: number;
  }>;
  histories: Array<{
    fromStatus: string;
    toStatus: string;
    actorType: string;
    actorId: string;
    createdAt: string;
  }>;
};

export type PartnerOrderSummary = {
  orderNumber: string;
  itemSummary: string;
  estimatedAmount: number;
  status: string;
  createdAt: string;
};

export type PartnerOrderDetail = Omit<PartnerOrderSummary, "itemSummary"> & {
  items: AdminOrderDetail["items"];
};

export function listOrdersByPartner(
  partnerUserId: string,
): PartnerOrderSummary[] {
  const rows = getDatabase()
    .prepare(`
      SELECT
        o.order_number,
        o.status,
        o.estimated_amount,
        o.created_at,
        COALESCE(
          GROUP_CONCAT(oi.product_name || ' ' || oi.quantity || '장', ', '),
          ''
        ) AS item_summary
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.partner_user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC, o.id DESC
    `)
    .all(partnerUserId) as PartnerOrderSummaryRow[];

  return rows.map((row) => ({
    orderNumber: row.order_number,
    itemSummary: row.item_summary,
    estimatedAmount: row.estimated_amount,
    status: normalizeOrderStatus(row.status),
    createdAt: row.created_at,
  }));
}

export function getOrderByNumberForPartner(
  orderNumber: string,
  partnerUserId: string,
): PartnerOrderDetail | null {
  const database = getDatabase();
  const order = database
    .prepare(`
      SELECT order_number, status, estimated_amount, created_at
      FROM orders
      WHERE order_number = ? AND partner_user_id = ?
    `)
    .get(orderNumber, partnerUserId) as PartnerOrderRow | undefined;

  if (!order) return null;

  const items = database
    .prepare(`
      SELECT product_id, product_name, unit_price, quantity, line_amount
      FROM order_items
      WHERE order_id = (
        SELECT id
        FROM orders
        WHERE order_number = ? AND partner_user_id = ?
      )
      ORDER BY id
    `)
    .all(orderNumber, partnerUserId) as OrderItemRow[];

  return {
    orderNumber: order.order_number,
    estimatedAmount: order.estimated_amount,
    status: normalizeOrderStatus(order.status),
    createdAt: order.created_at,
    items: items.map((item) => ({
      productId: item.product_id,
      productName: item.product_name,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      lineAmount: item.line_amount,
    })),
  };
}

export function listOrders(): AdminOrderSummary[] {
  const rows = getDatabase()
    .prepare(`
      SELECT
        o.order_number,
        o.company_name,
        o.status,
        o.estimated_amount,
        o.created_at,
        COALESCE(
          GROUP_CONCAT(oi.product_name || ' ' || oi.quantity || '장', ', '),
          ''
        ) AS item_summary
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC, o.id DESC
    `)
    .all() as OrderSummaryRow[];

  return rows.map((row) => ({
    orderNumber: row.order_number,
    companyName: row.company_name,
    itemSummary: row.item_summary,
    estimatedAmount: row.estimated_amount,
    status: normalizeOrderStatus(row.status),
    createdAt: row.created_at,
  }));
}

export function getOrderByNumber(orderNumber: string): AdminOrderDetail | null {
  const database = getDatabase();
  const order = database
    .prepare(`
      SELECT order_number, company_name, status, estimated_amount, created_at
      FROM orders
      WHERE order_number = ?
    `)
    .get(orderNumber) as OrderRow | undefined;

  if (!order) return null;

  const items = database
    .prepare(`
      SELECT product_id, product_name, unit_price, quantity, line_amount
      FROM order_items
      WHERE order_id = (SELECT id FROM orders WHERE order_number = ?)
      ORDER BY id
    `)
    .all(orderNumber) as OrderItemRow[];
  const histories = database
    .prepare(`
      SELECT from_status, to_status, actor_type, actor_id, created_at
      FROM order_status_histories
      WHERE order_id = (SELECT id FROM orders WHERE order_number = ?)
      ORDER BY created_at DESC, id DESC
    `)
    .all(orderNumber) as OrderHistoryRow[];

  return {
    orderNumber: order.order_number,
    companyName: order.company_name,
    estimatedAmount: order.estimated_amount,
    status: normalizeOrderStatus(order.status),
    createdAt: order.created_at,
    items: items.map((item) => ({
      productId: item.product_id,
      productName: item.product_name,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      lineAmount: item.line_amount,
    })),
    histories: histories.map((history) => ({
      fromStatus: history.from_status,
      toStatus: history.to_status,
      actorType: history.actor_type,
      actorId: history.actor_id,
      createdAt: history.created_at,
    })),
  };
}

export function advanceOrderStatus(orderNumber: string, actorId: string) {
  const database = getDatabase();

  return database.transaction(() => {
    const order = database
      .prepare("SELECT id, status FROM orders WHERE order_number = ?")
      .get(orderNumber) as { id: number; status: string } | undefined;

    if (!order) throw new Error("주문을 찾을 수 없습니다.");

    const normalizedStatus = normalizeOrderStatus(order.status);
    const currentIndex = orderStatusSteps.findIndex(
      (status) => status === normalizedStatus,
    );
    if (currentIndex < 0) throw new Error("현재 주문 상태를 변경할 수 없습니다.");
    if (currentIndex === orderStatusSteps.length - 1) {
      throw new Error("이미 마지막 단계까지 완료된 주문입니다.");
    }

    const nextStatus = orderStatusSteps[currentIndex + 1];
    const update = database
      .prepare("UPDATE orders SET status = ? WHERE id = ? AND status = ?")
      .run(nextStatus, order.id, order.status);
    if (update.changes !== 1) {
      throw new Error("다른 작업자가 상태를 변경했습니다. 화면을 새로고침해 주세요.");
    }

    const createdAt = new Date().toISOString();
    database
      .prepare(`
        INSERT INTO order_status_histories (
          order_id, from_status, to_status, actor_type, actor_id,
          reason_code, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        order.id,
        order.status,
        nextStatus,
        "ADMIN",
        actorId,
        "DEMO_NEXT_STEP",
        createdAt,
      );

    return { fromStatus: order.status, toStatus: nextStatus, createdAt };
  })();
}

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

export function createOrder(
  partnerUserId: string,
  companyName: string,
  items: OrderItemInput[],
) {
  const database = getDatabase();

  return database.transaction(() => {
    const calculation = calculateOrderWithDatabase(database, items);
    if (calculation.lines.length === 0) {
      throw new Error("한 개 이상의 품목을 선택해 주세요.");
    }

    const createdAt = new Date().toISOString();
    const insertOrder = database.prepare(`
      INSERT INTO orders (
        order_number, partner_user_id, company_name, status,
        estimated_amount, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    let orderNumber = "";
    let orderId: number | bigint | undefined;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      orderNumber = createOrderNumber();
      try {
        orderId = insertOrder.run(
          orderNumber,
          partnerUserId,
          companyName,
          "신청접수",
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
