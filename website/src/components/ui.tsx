import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./icons";

/* ═══════════════ 레이아웃 ═══════════════ */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-page px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  tone = "paper",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "white" | "tint" | "navy";
  id?: string;
}) {
  const tones = {
    paper: "bg-paper",
    white: "bg-white",
    tint: "bg-tint",
    navy: "bg-navy text-white",
  } as const;

  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

/** 섹션 머리 — 아이브로 + 제목 + 리드 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  tone = "light",
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <p
          className={`mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.18em] ${
            align === "center" ? "justify-center" : ""
          } ${dark ? "text-pale" : "text-brand"}`}
        >
          <span
            className={`h-0.5 w-6 rounded-full ${dark ? "bg-ci-cyan" : "bg-sky"}`}
            aria-hidden="true"
          />
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[1.625rem] leading-[1.28] sm:text-[2rem] lg:text-[2.125rem] ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-4 text-base leading-[1.8] sm:text-[1.0625rem] ${
            dark ? "text-pale/90" : "text-ink-2"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* ═══════════════ 버튼 ═══════════════ */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-brand text-[0.9375rem] font-bold tracking-[-0.01em] whitespace-nowrap transition-all duration-200 ease-brand disabled:opacity-45 disabled:pointer-events-none";

const buttonVariants = {
  primary: "bg-brand text-white hover:bg-brand-hover hover:shadow-raised",
  tel: "bg-navy text-white hover:bg-navy-deep",
  ghost:
    "text-brand shadow-[inset_0_0_0_1.5px_var(--color-brand)] hover:bg-brand/7",
  onNavy: "bg-white text-navy hover:bg-tint",
  onNavyGhost:
    "text-white shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.55)] hover:bg-white/12",
} as const;

const buttonSizes = {
  md: "px-6 py-3.5",
  sm: "px-4 py-2.5 text-sm",
  lg: "px-7 py-4 text-base",
} as const;

export type ButtonLook = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  block?: boolean;
};

function look({ variant = "primary", size = "md", block }: ButtonLook, extra = "") {
  return [
    buttonBase,
    buttonVariants[variant],
    buttonSizes[size],
    block ? "w-full" : "",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ButtonLink({
  variant,
  size,
  block,
  className = "",
  ...props
}: ButtonLook & ComponentProps<typeof Link>) {
  return <Link className={look({ variant, size, block }, className)} {...props} />;
}

/** 외부 링크·tel: 은 next/link 대신 a 를 쓴다 */
export function ButtonAnchor({
  variant,
  size,
  block,
  className = "",
  ...props
}: ButtonLook & ComponentProps<"a">) {
  return <a className={look({ variant, size, block }, className)} {...props} />;
}

export function Button({
  variant,
  size,
  block,
  className = "",
  ...props
}: ButtonLook & ComponentProps<"button">) {
  return <button className={look({ variant, size, block }, className)} {...props} />;
}

/** 전화 버튼 — 아이콘 + 번호. tel: 링크는 필수(이미지로 넣지 말 것) */
export function TelButton({
  tel,
  telHref,
  variant = "tel",
  size,
  block,
  className,
}: {
  tel: string;
  telHref: string;
} & ButtonLook & { className?: string }) {
  return (
    <ButtonAnchor
      href={telHref}
      variant={variant}
      size={size}
      block={block}
      className={className}
    >
      <Icon.phone className="size-[1.0625rem] shrink-0" />
      <span data-numeric>{tel}</span>
    </ButtonAnchor>
  );
}

/* ═══════════════ 배지 · 칩 ═══════════════ */

/** 배지는 검증된 자격에만 쓴다 */
export function Badge({
  children,
  tone = "solid",
  className = "",
}: {
  children: ReactNode;
  tone?: "solid" | "outline" | "onNavy";
  className?: string;
}) {
  const tones = {
    solid: "bg-navy text-white",
    outline: "text-navy shadow-[inset_0_0_0_1.5px_var(--color-pale)]",
    onNavy:
      "bg-white/10 text-pale shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)]",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold tracking-[-0.01em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** 칩은 분류 정보에만 쓴다. 클릭되지 않는다 */
export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-tint px-3.5 py-1.5 text-[0.8125rem] font-semibold text-navy ${className}`}
    >
      {children}
    </span>
  );
}

/* ═══════════════ 카드 ═══════════════ */

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <As
      className={`rounded-brand border border-line bg-white shadow-card ${className}`}
    >
      {children}
    </As>
  );
}

/** 원형 아이콘 배지 — 카드 머리에 쓴다 */
export function IconBubble({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  const sizes = { sm: "size-10", md: "size-12" } as const;
  return (
    <span
      className={`flex ${sizes[size]} shrink-0 items-center justify-center rounded-full bg-tint text-brand ${className}`}
    >
      {children}
    </span>
  );
}

/* ═══════════════ 알림 ═══════════════ */

export function Alert({
  tone,
  title,
  children,
  className = "",
}: {
  tone: "ok" | "warn" | "danger";
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const tones = {
    ok: "bg-ok-bg border-ok/25 text-ok",
    warn: "bg-warn-bg border-warn/25 text-warn",
    danger: "bg-danger-bg border-danger/25 text-danger",
  } as const;

  const Glyph = tone === "ok" ? Icon.check : Icon.alert;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-brand border px-4 py-3.5 text-sm font-semibold leading-relaxed ${tones[tone]} ${className}`}
    >
      <Glyph className="mt-0.5 size-[1.125rem] shrink-0" />
      <span>
        {title && <strong className="block">{title}</strong>}
        {children}
      </span>
    </div>
  );
}

