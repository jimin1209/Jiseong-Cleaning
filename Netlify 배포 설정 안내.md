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
| `ADMIN_USER` | 관리자 아이디 | 필수 |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | 필수 |
| `NEXT_PUBLIC_SITE_URL` | 도메인 연결 후 `https://www.jiseong-cleaning.co.kr` | 선택 |
| `NEXT_PUBLIC_SAMPLE_CONTENT` | `off` — 임시값 배너를 끌 때 | 선택 |

> ⚠️ **`NEXT_PUBLIC_SITE_URL` 은 값을 넣을 거면 넣고, 아니면 변수를 아예 만들지 마세요.**
> 변수만 만들고 값을 비워두면 빈 문자열이 들어갑니다. 예전에는 그것 때문에
> `metadataBase` 의 `new URL()` 이 터져 빌드가 실패했습니다. 지금은 빈 값·잘못된
> 값을 무시하도록 고쳤지만, 굳이 빈 변수를 만들 이유가 없습니다.
>
> 이 변수를 넣지 않으면 Netlify 가 배포마다 자동으로 주는 주소(`URL`)를 씁니다.
> 그래서 도메인 연결 전에도 `sitemap.xml` 과 OG 태그가 맞습니다.

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

운영 도메인은 `jiseong-cleaning.co.kr` 입니다. 가비아에서 등록했고, 네임서버도
가비아에 그대로 둔 채 DNS 레코드만 Netlify 로 향하게 합니다.

순서를 지켜야 합니다. Netlify 기본 주소(`○○.netlify.app`)로 사이트가 정상인지
먼저 확인한 뒤에 도메인을 붙이세요.

### 1) Netlify 에 도메인 등록

Domain management → Add domain → `www.jiseong-cleaning.co.kr`.
Netlify 가 루트 도메인까지 함께 등록합니다.

기본 도메인(primary)은 `www` 쪽으로 둡니다. 외부 DNS 를 쓸 때 루트 도메인은
Netlify CDN 의 직접 라우팅을 쓸 수 없기 때문입니다. 루트는 www 로 리다이렉트됩니다.

### 2) 가비아 DNS 레코드

My가비아 → DNS 관리툴 → 호스트 관리에서 두 줄을 넣습니다.

| 호스트 이름 | 타입 | 값 |
| --- | --- | --- |
| www | CNAME | `○○.netlify.app` (사이트 기본 주소) |
| (비움 = 루트) | A | `75.2.60.5` |

가비아 DNS 는 ALIAS·ANAME 을 지원하지 않으므로 루트는 A 레코드로 갑니다.
루트를 빼먹으면 `www.` 를 붙일 때만 열립니다. 반영은 10분~1시간입니다.

### 3) 환경변수와 SSL

`NEXT_PUBLIC_SITE_URL` 을 `https://www.jiseong-cleaning.co.kr` 로 바꾸고
재배포하세요. `sitemap.xml` 과 검색엔진용 정보가 이 값을 씁니다.

SSL 인증서는 Netlify 가 자동 발급합니다. DNS 반영 전에 누르면 실패하므로
레코드가 조회되는 것을 확인한 뒤 발급하세요.

### 참고

모회사 `jiseong.co.kr` 은 `www` 를 붙이면 도메인 파킹 페이지로 갑니다.
그 도메인의 DNS 설정 문제이고, 이 사이트와는 무관합니다.
여기서는 www·루트 양쪽을 모두 등록하므로 같은 문제가 생기지 않습니다.

## Netlify 를 쓰지 않는 경우

사내 서버나 VPS 에 직접 올리려면 `website/README.md` 의 「배포」 절을 보세요.
`npm run pack` 으로 25MB 짜리 `deploy/` 폴더를 만들어 올리고
`node server.js` 하면 됩니다. 그때는 SQLite 파일에 저장됩니다.
