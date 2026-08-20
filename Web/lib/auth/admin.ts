import { redirect } from "next/navigation";
import { getDemoSession } from "./session";

export async function requireAdminSession() {
  const session = await getDemoSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}
