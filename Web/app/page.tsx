import { redirect } from "next/navigation";
import { getDemoSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getDemoSession();

  redirect(session ? "/dashboard" : "/login");
}
