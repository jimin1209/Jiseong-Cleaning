import Link from "next/link";
import { getDemoSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getDemoSession();

  return (
    <main className="landing">
      <section className="landing-copy">
        <p className="brand">JISEONG CLEANING · B2B</p>
        <h1>사업장 세탁을<br />한 번에 발주하세요.</h1>
        <p className="description">
          호텔, 식당 등 업소용 세탁물을 품목별로 간편하게 접수할 수 있습니다.
        </p>
        <Link className="primary-link" href={session ? "/orders/new" : "/partner/login"}>
          {session ? "발주 계속하기" : "거래처로 시작"}
        </Link>
      </section>
      <aside className="landing-panel" aria-label="서비스 안내">
        <span>01</span><p>거래처명으로 간편 시작</p>
        <span>02</span><p>대량 품목 수량 입력</p>
        <span>03</span><p>예상 금액 확인 후 발주</p>
      </aside>
    </main>
  );
}
