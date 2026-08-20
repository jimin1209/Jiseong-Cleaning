import { createHmac, randomUUID } from "node:crypto";
import { getDatabase } from "@/lib/db/sqlite";

type PartnerRow = {
  user_id: string;
  company_name: string;
};

export function findOrCreateDemoPartner(
  companyName: string,
  partnerCodeInput: string,
) {
  const database = getDatabase();
  const partnerCode = normalizePartnerCode(partnerCodeInput);
  const partnerCodeHash = hashPartnerCode(partnerCode);
  const findByCodeHash = database.prepare(`
    SELECT user_id, company_name
    FROM demo_partners
    WHERE partner_code_hash = ?
  `);

  const existing = findByCodeHash.get(partnerCodeHash) as
    | PartnerRow
    | undefined;

  if (existing) {
    return toPartner(existing);
  }

  const userId = randomUUID();

  try {
    database
      .prepare(`
        INSERT INTO demo_partners (
          user_id,
          company_name,
          partner_code_hash
        ) VALUES (?, ?, ?)
      `)
      .run(userId, companyName, partnerCodeHash);

    return { userId, companyName };
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const concurrentlyCreated = findByCodeHash.get(partnerCodeHash) as
      | PartnerRow
      | undefined;

    if (!concurrentlyCreated) {
      throw error;
    }

    return toPartner(concurrentlyCreated);
  }
}

export function getDemoPartner(userId: string) {
  const row = getDatabase()
    .prepare(`
      SELECT user_id, company_name
      FROM demo_partners
      WHERE user_id = ?
    `)
    .get(userId) as PartnerRow | undefined;

  return row ? toPartner(row) : null;
}

function normalizePartnerCode(value: string) {
  const code = value.trim().toUpperCase();

  if (code.length < 10 || code.length > 32) {
    throw new Error("거래처 코드는 10~32자로 입력해 주세요.");
  }

  if (!/^[A-Z0-9-]+$/.test(code)) {
    throw new Error("거래처 코드는 영문, 숫자, 하이픈만 사용할 수 있습니다.");
  }

  if (!/[A-Z]/.test(code) || !/[0-9]/.test(code)) {
    throw new Error("거래처 코드는 영문과 숫자를 모두 포함해야 합니다.");
  }

  return code;
}

function hashPartnerCode(partnerCode: string) {
  const secret = process.env.PARTNER_CODE_HMAC_SECRET;

  if (!secret) {
    throw new Error("거래처 코드 인증 환경변수가 설정되지 않았습니다.");
  }

  return createHmac("sha256", secret).update(partnerCode).digest("hex");
}

function toPartner(row: PartnerRow) {
  return {
    userId: row.user_id,
    companyName: row.company_name,
  };
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    (error.code === "SQLITE_CONSTRAINT_UNIQUE" ||
      error.code === "SQLITE_CONSTRAINT_PRIMARYKEY")
  );
}
