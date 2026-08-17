import { Icon } from "@/components/icons";
import { ButtonAnchor, ButtonLink, Container } from "@/components/ui";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="bg-paper py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p
            className="text-[0.6875rem] font-bold tracking-[0.2em] text-brand"
            data-numeric
          >
            4 0 4
          </p>
          <h1 className="mt-4 text-[1.75rem] text-navy sm:text-[2.125rem]">
            요청하신 페이지를 찾을 수 없습니다
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-[1.8] text-ink-2">
            주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 찾으시는 내용이 있으시면
            전화로 문의해 주세요.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              홈으로
              <Icon.arrowRight className="size-4" />
            </ButtonLink>
            <ButtonAnchor href={site.telHref} variant="ghost" size="lg">
              <Icon.phone className="size-[1.0625rem]" />
              <span data-numeric>{site.tel}</span>
            </ButtonAnchor>
          </div>
        </div>
      </Container>
    </div>
  );
}
