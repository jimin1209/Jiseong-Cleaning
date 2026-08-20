import { redirect } from "next/navigation";
import { getDemoSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getDemoSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="brand">JISEONG CLEANING</p>
        <h1>로그인</h1>
        <p className="description">
          관리자 데모 서비스에 접속합니다.
        </p>
        <LoginForm />
        <p className="test-notice">
          관리자 테스트 번호는 010-0000-0000입니다. 실제 휴대폰 인증은
          진행하지 않습니다.
        </p>
      </section>
    </main>
  );
}
