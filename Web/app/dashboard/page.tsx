import { redirect } from "next/navigation";
import { getDemoSession } from "@/lib/auth/session";
import { logout } from "./actions";

export default async function DashboardPage() {
  const session = await getDemoSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="brand">JISEONG CLEANING</p>
        <h1>로그인 완료</h1>
        <p className="description">
          테스트 세션이 생성되었습니다. 실제 서비스 기능은 아직 없습니다.
        </p>
        <div className="session-list">
          <div className="session-row">
            <span>테스트 사용자</span>
            <strong>{session.userId.slice(0, 8)}</strong>
          </div>
          <div className="session-row">
            <span>역할</span>
            <strong>{session.role === "ADMIN" ? "관리자" : "고객"}</strong>
          </div>
        </div>
        <form action={logout}>
          <button className="secondary-button" type="submit">
            로그아웃
          </button>
        </form>
      </section>
    </main>
  );
}
