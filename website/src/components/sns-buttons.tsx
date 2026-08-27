"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "./copy-text";
import { Icon } from "./icons";
import { snsLinks } from "@/lib/sample";

/**
 * SNS 버튼 (명세 9-6) — 인스타그램·네이버 블로그.
 * 계정 개설 전이라 링크가 없으면 버튼만 노출하고, 누르면 "준비 중" 안내를 띄운다.
 * 링크(sample.ts snsLinks)가 채워지면 그대로 새 창 링크가 된다.
 */
export function SnsButtons({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const [notice, setNotice] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const showNotice = () => {
    setNotice(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(false), 4000);
  };

  const buttonClass = `rounded-brand p-2 transition-colors duration-150 ${
    tone === "dark"
      ? "text-[#C3D6EC] hover:bg-white/10 hover:text-white"
      : "text-navy hover:bg-tint"
  }`;

  const items = [
    { key: "instagram", label: "인스타그램", href: snsLinks.instagram, Glyph: Icon.instagram },
    { key: "blog", label: "네이버 블로그", href: snsLinks.naverBlog, Glyph: Icon.blog },
  ] as const;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {items.map(({ key, label, href, Glyph }) =>
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={buttonClass}
          >
            <Glyph className="size-5" />
          </a>
        ) : (
          <button
            key={key}
            type="button"
            aria-label={`${label} — 준비 중`}
            onClick={showNotice}
            className={buttonClass}
          >
            <Glyph className="size-5" />
          </button>
        ),
      )}
      {notice && (
        <span
          role="status"
          className={`ml-1.5 text-[0.8125rem] font-semibold ${
            tone === "dark" ? "text-[#C08A4A]" : "text-warn"
          }`}
        >
          <T k="sns.notice" />
        </span>
      )}
    </div>
  );
}
