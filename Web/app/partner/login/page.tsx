import Link from "next/link";
import { PartnerLoginForm } from "./partner-login-form";

export default function PartnerLoginPage() {
  return (
    <main className="page-shell">
      <section className="card">
        <Link className="back-link" href="/">← 처음으로</Link>
        <p className="brand">PARTNER LOGIN</p>
        <h1>거래처 시작</h1>
        <p className="description">데모에서는 아무 업체명으로 바로 시작할 수 있습니다.</p>
        <PartnerLoginForm />
        <p className="test-notice">실제 사업자 인증 없이 동작하는 테스트용 로그인입니다.</p>
      </section>
    </main>
  );
}
