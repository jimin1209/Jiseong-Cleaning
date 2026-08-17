/**
 * 배포 폴더를 만든다.
 *
 * Next 의 standalone 출력(.next/standalone)은 서버 실행에 필요한 코드만 담지만,
 * `public` 과 `.next/static` 은 넣어주지 않는다(문서에 명시된 동작).
 * 이 스크립트가 그 둘을 복사해 **그대로 복사만 하면 되는 한 폴더**를 완성한다.
 *
 *   npm run pack   →  deploy/  가 만들어진다
 *
 * 서버에서는 deploy 폴더를 올린 뒤:
 *   node server.js        (기본 포트 3000, PORT 환경변수로 변경)
 */
import { cp, mkdir, rm, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");
const out = path.join(root, "deploy");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(standalone))) {
  console.error(
    "[pack] .next/standalone 이 없습니다. `npm run build` 를 먼저 실행하세요.",
  );
  process.exit(1);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// 1) standalone 본체 (server.js + 최소 node_modules)
await cp(standalone, out, { recursive: true });

// 2) 정적 자산 — Next 가 자동으로 넣지 않는다
await cp(path.join(root, ".next", "static"), path.join(out, ".next", "static"), {
  recursive: true,
});

// 3) public (폰트·브랜드 SVG). predev/prebuild 가 생성한 폰트도 여기 들어 있다
await cp(path.join(root, "public"), path.join(out, "public"), { recursive: true });

// 4) 서버에서 뭘 해야 하는지 폴더 안에 남긴다
await writeFile(
  path.join(out, "실행방법.txt"),
  [
    "지성크리닝 홍보 웹사이트 — 배포 폴더",
    "",
    "이 폴더를 서버에 그대로 올린 뒤:",
    "",
    "  node server.js",
    "",
    "기본 포트는 3000입니다. 바꾸려면:",
    "",
    "  PORT=8080 node server.js        (Linux / macOS)",
    "  $env:PORT=8080; node server.js  (Windows PowerShell)",
    "",
    "필요한 것: Node.js 20 이상. npm install 은 하지 않아도 됩니다",
    "(필요한 모듈이 이미 이 폴더 안에 들어 있습니다).",
    "",
    "환경변수는 이 폴더에 .env.production 파일로 두거나 서버에 직접 설정하세요.",
    "반드시 설정해야 하는 것:",
    "",
    "  NEXT_PUBLIC_SITE_URL        실제 도메인 (www 없이)",
    "  ADMIN_USER / ADMIN_PASSWORD /admin 접속 계정 (비우면 503으로 막힘)",
    "  NEXT_PUBLIC_SAMPLE_CONTENT=off   임시값 배너를 끌 때",
    "",
    "견적 문의는 .data/inquiries.db 파일에 저장됩니다.",
    "서버를 옮기거나 폴더를 갈아끼울 때 이 파일을 함께 옮기지 않으면 접수 내역이 사라집니다.",
    "",
  ].join("\n"),
  "utf8",
);

// 용량 보고
async function dirSize(p) {
  const { readdir } = await import("node:fs/promises");
  let total = 0;
  for (const e of await readdir(p, { withFileTypes: true })) {
    const full = path.join(p, e.name);
    if (e.isDirectory()) total += await dirSize(full);
    else total += (await stat(full)).size;
  }
  return total;
}

const mb = (await dirSize(out)) / 1024 / 1024;
console.log(
  `[pack] deploy/ 완성 — ${mb.toFixed(1)} MB. 이 폴더를 그대로 올리고 \`node server.js\` 하세요.`,
);
