import { getDatabase } from "@/lib/db/sqlite";

type PartnerRow = { company_name: string };

export function saveDemoPartner(userId: string, companyName: string) {
  getDatabase()
    .prepare(`
      INSERT INTO demo_partners (user_id, company_name)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET company_name = excluded.company_name
    `)
    .run(userId, companyName);
}

export function getDemoPartner(userId: string) {
  const row = getDatabase()
    .prepare("SELECT company_name FROM demo_partners WHERE user_id = ?")
    .get(userId) as PartnerRow | undefined;

  return row ? { companyName: row.company_name } : null;
}
