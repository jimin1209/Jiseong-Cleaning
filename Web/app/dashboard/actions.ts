"use server";

import { redirect } from "next/navigation";
import { deleteDemoSession } from "@/lib/auth/session";

export async function logout() {
  await deleteDemoSession();
  redirect("/login");
}
