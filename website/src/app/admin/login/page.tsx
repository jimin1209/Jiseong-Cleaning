import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-brand border border-line bg-white p-8 shadow-card">
        <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
          관 리 자
        </p>
        <h1 className="mt-2 text-[1.375rem] text-navy">지성크리닝 관리</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          로그인하면 30일 동안 유지됩니다.
        </p>
        <LoginForm next={next ?? ""} />
      </div>
    </div>
  );
}
