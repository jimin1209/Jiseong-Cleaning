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
          지성크리닝 데모 서비스에 접속합니다.
        </p>
        <LoginForm />
        <p className="test-notice">
          테스트 전용 화면입니다. 실제 휴대폰 인증 없이 아무 번호나 입력하면
          고객으로 로그인됩니다.
        </p>
      </section>
    </main>
  );
}
