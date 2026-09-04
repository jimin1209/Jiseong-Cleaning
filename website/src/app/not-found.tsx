import { TelButtonAnchor, TelMobileButtonAnchor } from "@/components/contact-links";
import { T } from "@/components/copy-text";
import { Icon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="bg-paper py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p
            className="text-[0.6875rem] font-bold tracking-[0.2em] text-brand"
            data-numeric
          >
            <T k="notFound.code" />
          </p>
          <h1 className="mt-4 text-[1.75rem] text-navy sm:text-[2.125rem]">
            <T k="notFound.title" />
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-[1.8] text-ink-2">
            <T k="notFound.body" />
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              <T k="notFound.homeCta" />
              <Icon.arrowRight className="size-4" />
            </ButtonLink>
            <TelButtonAnchor variant="ghost" size="lg">
              <Icon.phone className="size-[1.0625rem]" />
              <span data-numeric>
                <T k="site.tel" />
              </span>
            </TelButtonAnchor>
            {/* 휴대전화 — 대표전화와 나란히 두고, 각 버튼은 자기 번호로 건다 */}
            <TelMobileButtonAnchor variant="ghost" size="lg">
              <Icon.smartphone className="size-[1.0625rem]" />
              <span data-numeric>
                <T k="site.telMobile" />
              </span>
            </TelMobileButtonAnchor>
          </div>
        </div>
      </Container>
    </div>
  );
}
