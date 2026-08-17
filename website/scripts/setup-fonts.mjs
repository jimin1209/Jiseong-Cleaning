/**
 * Pretendard 동적 서브셋을 public/fonts/pretendard 로 복사하고,
 * URL을 웹 경로로 바꾼 CSS를 함께 생성한다.
 *
 * 왜 스크립트인가: 전체 가변 폰트는 2MB라 한 번에 받게 하면 LCP가 무너진다.
 * Pretendard가 제공하는 92분할 서브셋은 unicode-range로 나뉘어 있어
 * 브라우저가 실제로 쓰인 글자 범위만 받는다(보통 100~200KB).
 * node_modules 에서 빌드 때마다 꺼내오므로 폰트 바이너리를 저장소에 넣지 않는다.
 *
 * predev / prebuild 에서 자동 실행된다.
 */
import { cp, mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendor = path.join(root, "node_modules", "pretendard", "dist", "web", "variable");
const srcSubset = path.join(vendor, "woff2-dynamic-subset");
const srcCss = path.join(vendor, "pretendardvariable-dynamic-subset.css");

const outDir = path.join(root, "public", "fonts", "pretendard");
const outCss = path.join(root, "src", "styles", "pretendard.css");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(srcSubset))) {
  console.error(
    "[setup-fonts] pretendard 패키지를 찾을 수 없습니다. `npm install` 을 먼저 실행하세요.",
  );
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
await cp(srcSubset, outDir, { recursive: true });

const css = await readFile(srcCss, "utf8");
const rewritten = css.replaceAll(
  "./woff2-dynamic-subset/",
  "/fonts/pretendard/",
);

await mkdir(path.dirname(outCss), { recursive: true });
await writeFile(
  outCss,
  `/* 생성 파일 — 직접 고치지 마세요. scripts/setup-fonts.mjs 가 만듭니다. */\n${rewritten}`,
  "utf8",
);

const count = (rewritten.match(/@font-face/g) ?? []).length;
console.log(`[setup-fonts] @font-face ${count}개, woff2 서브셋을 public/fonts/pretendard 에 배치했습니다.`);
