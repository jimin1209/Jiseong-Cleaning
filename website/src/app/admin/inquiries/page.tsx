import type { Metadata } from "next";
import { countInquiries, listInquiries, storageBackend } from "@/lib/inquiries";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "견적 문의 목록",
  robots: { index: false, follow: false },
};

/** 접수 즉시 반영돼야 하므로 캐시하지 않는다 */
export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminInquiriesPage() {
  const [inquiries, total] = await Promise.all([listInquiries(), countInquiries()]);

  return (
    <div className="min-h-screen bg-paper py-10">
      <Container>
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
              관 리 자
            </p>
            <h1 className="mt-1.5 text-[1.625rem] text-navy">견적 문의 목록</h1>
            <p className="mt-2 text-sm text-muted">
              총{" "}
              <strong className="font-bold text-navy" data-numeric>
                {total}
              </strong>
              건 · 최근 200건 표시
            </p>
          </div>
          <a
            href={site.telHref}
            className="text-sm font-bold text-brand"
            data-numeric
          >
            {site.tel}
          </a>
        </header>

        {inquiries.length === 0 ? (
          <div className="rounded-brand border border-line bg-white p-10 text-center text-muted shadow-card">
            아직 접수된 문의가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-brand border border-line bg-white shadow-card">
            <table className="w-full min-w-[48rem] border-collapse text-sm">
              <thead>
                <tr>
                  {["접수", "업체명", "성함 · 연락처", "주소", "문의 내용"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-line bg-tint px-4 py-3 text-left text-[0.6875rem] font-bold tracking-[0.08em] whitespace-nowrap text-navy"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inquiries.map((q) => (
                  <tr key={q.id} className="align-top">
                    <td className="border-b border-line px-4 py-3.5 whitespace-nowrap text-muted">
                      <span className="block font-bold text-navy" data-numeric>
                        #{q.id}
                      </span>
                      <span className="text-[0.78rem]" data-numeric>
                        {formatDate(q.createdAt)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="block font-bold text-ink">{q.company}</span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5 whitespace-nowrap">
                      <span className="block text-ink-2">{q.contactName}</span>
                      <a
                        href={`tel:${q.phone.replace(/-/g, "")}`}
                        className="font-bold text-brand"
                        data-numeric
                      >
                        {q.phone}
                      </a>
                      {q.email && (
                        <a
                          href={`mailto:${q.email}`}
                          className="mt-0.5 block text-[0.78rem] text-muted"
                        >
                          {q.email}
                        </a>
                      )}
                    </td>
                    <td className="border-b border-line px-4 py-3.5 text-ink-2">
                      {q.region}
                    </td>
                    <td className="border-b border-line px-4 py-3.5 text-ink-2">
                      <span className="block max-w-[22rem] whitespace-pre-wrap">
                        {q.message || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-5 text-[0.78rem] leading-[1.7] text-muted">
          저장 위치 : <strong className="text-ink">{storageBackend}</strong>
          {storageBackend === "SQLite 파일" && (
            <>
              {" "}
              (<code>.data/inquiries.db</code>) — 서버를 옮기거나 배포 폴더를
              갈아끼울 때 이 파일을 함께 옮기지 않으면 접수 내역이 사라집니다.
            </>
          )}
        </p>
      </Container>
    </div>
  );
}
