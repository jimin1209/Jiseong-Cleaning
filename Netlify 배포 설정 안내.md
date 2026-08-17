# Netlify 배포 안내 — 지성크리닝 홍보 웹사이트

이 저장소는 폴더가 두 개입니다. Netlify 에서 **어느 폴더를 빌드할지 반드시 지정**해야 합니다.

| 폴더 | 내용 |
| --- | --- |
| `website/` | 홍보 웹사이트 ← **이걸 배포합니다** |
| `Web/` | 발주·정산 데모 (별개) |

설정 파일은 `website/netlify.toml` 에 들어 있어서, Base directory 만 맞추면
빌드 명령과 플러그인은 자동으로 잡힙니다.

---

## 1. 사이트 만들기

Netlify → **Add new site** → **Import an existing project** → GitHub →
`niesoftservice-ui/Jiseong-Cleaning` 선택.

## 2. 빌드 설정 — 여기가 핵심입니다

| 항목 | 값 |
| --- | --- |
| **Branch to deploy** | `feature/marketing-website` (아직 main 에 병합 안 됨) |
| **Base directory** | `website` |
| Build command | `npm run build` (자동 인식) |
| Publish directory | 비워둠 (Next 런타임이 처리) |

**Base directory 를 `website` 로 지정하지 않으면** 저장소 최상위에
`package.json` 이 없어서 빌드가 바로 실패합니다.

## 3. 환경변수 (Site configuration → Environment variables)

| 변수 | 값 | 필수 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 배포된 실제 주소 (예: `https○○.netlify.app`) | 필수 |
| `ADMIN_USER` | 관리자 아이디 | 필수 |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | 필수 |
| `NEXT_PUBLIC_SAMPLE_CONTENT` | `off` — 임시값 배너를 끌 때 | 선택 |

`ADMIN_USER` / `ADMIN_PASSWORD` 를 넣지 않으면 `/admin/inquiries` 가 503 으로
완전히 막힙니다. 문의 목록에 거래처 연락처가 들어가므로 일부러 그렇게 만들었습니다.

`NEXT_PUBLIC_` 으로 시작하는 변수는 **빌드 시점에 값이 박히므로**, 바꾼 뒤에는
재배포(Trigger deploy)를 해야 반영됩니다.

## 4. 문의 저장 — 별도 설정 없이 동작합니다

Netlify 는 서버리스라 파일이 요청마다 초기화됩니다. 그래서 SQLite 를 쓰면
접수가 조용히 사라집니다. 이 사이트는 그걸 피하려고 **Netlify Blobs**
(Netlify 내장 저장소)를 자동으로 씁니다.

- 외부 서비스 가입, 연결 문자열, 추가 설정이 **없습니다**
- 어디에 저장되는지는 `/admin/inquiries` 화면 아래에 표시됩니다
- 로컬에서 `npm run dev` 로 돌릴 때는 그대로 SQLite 파일을 씁니다

전환은 `src/lib/inquiries.ts` 가 `NETLIFY` 환경변수를 보고 알아서 합니다.

## 5. 문의 알림 메일 (선택)

접수를 메일로도 받으시려면 아래 4개를 모두 넣으세요. 하나라도 비면 저장만 하고
조용히 넘어갑니다. 메일이 실패해도 접수는 취소되지 않습니다.

```
SMTP_HOST   smtp.naver.com      (또는 smtp.gmail.com / smtp.daum.net)
SMTP_PORT   587                 (다음은 465)
SMTP_USER   보내는 계정
SMTP_PASS   비밀번호 (구글은 앱 비밀번호)
INQUIRY_TO  문의를 받을 주소. 쉼표로 여러 개 가능
```

---

## 배포 후 확인할 것

1. 홈이 열리는지 — 헤더만 보이고 본문이 비면 빌드가 덜 된 것입니다
2. `/quote` 에서 폼을 실제로 보내보고 `/admin/inquiries` 에 뜨는지
3. 상단에 주황색 「검토용 샘플」 배너가 있는지 —
   **있으면 아직 임시값이 노출되는 상태**입니다. 실제 값을 채운 뒤
   `NEXT_PUBLIC_SAMPLE_CONTENT=off` 를 넣고 재배포하세요
4. 아무 페이지에서나 전화번호를 눌러 전화 앱이 열리는지

## 도메인

Netlify 기본 주소로 먼저 확인한 뒤, 실제 도메인을 붙일 때
**Domain management** 에서 연결하고 `NEXT_PUBLIC_SITE_URL` 을 그 주소로 바꿔
재배포하세요. `sitemap.xml` 과 검색엔진용 정보가 이 값을 씁니다.

`www` 를 붙이지 마세요. 모회사 `jiseong.co.kr` 은 `www` 를 붙이면 도메인 파킹
페이지로 가는 상태라, 같은 실수를 반복하지 않기 위한 규칙입니다.

## Netlify 를 쓰지 않는 경우

사내 서버나 VPS 에 직접 올리려면 `website/README.md` 의 「배포」 절을 보세요.
`npm run pack` 으로 25MB 짜리 `deploy/` 폴더를 만들어 올리고
`node server.js` 하면 됩니다. 그때는 SQLite 파일에 저장됩니다.
