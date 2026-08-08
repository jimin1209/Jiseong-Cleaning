# 05. API 명세

**Base URL:** `https://api.jiseong-cleaning.co.kr/api/v1`
**인증:** `Authorization: Bearer <access_token>` (refresh는 httpOnly 쿠키)
**공통 응답:**
```json
// 성공
{ "data": { ... }, "meta": { "page": 1, "totalCount": 42 } }
// 실패
{ "error": { "code": "ORDER_INVALID_TRANSITION", "message": "수거 완료 상태에서는 취소할 수 없습니다.", "details": {} } }
```
**표기:** 🔓 인증 불필요 · 👤 고객 · 🚚 기사 · 🏭 공장 · 🛠 관리자

---

## 1. 인증 (`/auth`)

| Method | Path | 권한 | 설명 |
|---|---|---|---|
| POST | `/auth/phone/send-code` | 🔓 | SMS 인증번호 발송 (분당 1회, 일 5회 제한) |
| POST | `/auth/phone/verify` | 🔓 | 인증번호 검증 → 신규면 가입 토큰, 기존이면 로그인 |
| POST | `/auth/signup` | 🔓 | 고객 가입 완료 (이름·약관동의) |
| POST | `/auth/login` | 🔓 | 이메일+비밀번호 로그인 (기사/공장/관리자) |
| POST | `/auth/refresh` | 🔓 | refresh 쿠키로 access 재발급 (토큰 회전) |
| POST | `/auth/logout` | all | refresh 무효화 |
| GET | `/auth/me` | all | 내 정보 + role |
| DELETE | `/auth/me` | 👤 | 회원 탈퇴 |

```jsonc
// POST /auth/phone/verify
{ "phone": "01012345678", "code": "123456" }
→ { "data": { "accessToken": "...", "isNewUser": false, "user": { "id": "...", "role": "CUSTOMER" } } }
```

---

## 2. 주소 (`/me/addresses`) 👤

| Method | Path | 설명 |
|---|---|---|
| GET | `/me/addresses` | 내 주소 목록 |
| POST | `/me/addresses` | 주소 추가 (좌표·행정동코드 자동 조회) |
| PATCH | `/me/addresses/:id` | 수정 |
| DELETE | `/me/addresses/:id` | soft delete |
| PATCH | `/me/addresses/:id/default` | 기본 주소 지정 |

---

## 3. 카탈로그 (`/catalog`) 🔓

| Method | Path | 설명 |
|---|---|---|
| GET | `/catalog/service-items` | 세탁 품목·요금표 (활성만) |
| GET | `/catalog/areas/check?areaCode=` | 서비스 가능 지역 여부 + **권역·운영요일·최소주문금액** 반환 |
| GET | `/catalog/slots?type=PICKUP&date=2026-08-10&areaCode=GJ_ANGANG` | 예약 가능 슬롯 + 잔여 정원 |
| GET | `/catalog/available-dates?areaCode=&type=&month=2026-08` | **권역 운영일 기준 예약 가능 날짜 목록** (달력 표시용) |
| POST | `/catalog/estimate` | 예상 금액 계산 |

> ⚠️ **`areaCode`는 필수다.** 경주는 권역별로 운영 요일이 다르므로(3권역은 화·목만)
> 지역을 모르면 예약 가능 슬롯을 계산할 수 없다.
> 판정식: `time_slots.weekdays ∩ service_areas.operating_days − holidays`

```jsonc
// GET /catalog/slots?type=PICKUP&date=2026-08-11&areaCode=GJ_ANGANG
// 안강읍(3권역)은 화·목 운영 → 8/11이 화요일이면 슬롯 반환, 아니면 빈 배열
→ { "data": {
      "areaCode": "GJ_ANGANG", "zone": 3, "minOrderAmount": 25000,
      "isOperatingDay": true,
      "slots": [ { "slotId": "...", "startTime": "18:00", "endTime": "21:00",
                   "capacity": 8, "remaining": 3 } ],
      "nextOperatingDate": "2026-08-13"
    } }

```jsonc
// POST /catalog/estimate
{ "items": [ {"serviceItemId": "...", "qty": 5}, {"serviceItemId": "...", "qty": 1} ],
  "subscriptionId": "..." }
→ { "data": { "subtotal": 25000, "subscriptionCovered": 20000,
              "payable": 5000, "breakdown": [...] } }
```

---

## 4. 주문 — 고객 (`/orders`) 👤

| Method | Path | 설명 |
|---|---|---|
| POST | `/orders` | 수거 신청 |
| GET | `/orders?status=&page=` | 내 주문 목록 |
| GET | `/orders/:id` | 주문 상세 (상태 이력·사진·금액 내역 포함) |
| POST | `/orders/:id/cancel` | 취소 (`PICKED_UP` 이후 불가) |
| POST | `/orders/:id/quote/approve` | 추가 금액 승인 |
| POST | `/orders/:id/quote/reject` | 추가 금액 거절 (사유) |
| GET | `/orders/:id/photos` | 수거·검수·배송 사진 |
| POST | `/orders/:id/issues` | 손상·분실 클레임 접수 |

### 알림 (`/me/notifications`) 👤 🚚 🏭
| Method | Path | 설명 |
|---|---|---|
| GET | `/me/notifications?unreadOnly=&page=` | 알림 목록 (홈 화면 🔔 배지용) |
| GET | `/me/notifications/unread-count` | 미읽음 개수 |
| PATCH | `/me/notifications/:id/read` | 읽음 처리 |
| PATCH | `/me/notifications/read-all` | 전체 읽음 |
| POST | `/me/push-tokens` | 웹푸시 구독 등록 (FCM 토큰) |
| DELETE | `/me/push-tokens/:id` | 구독 해제 |

```jsonc
// POST /orders
{
  "pickupAddressId": "uuid",
  "deliveryAddressId": "uuid",        // 생략 시 pickup과 동일
  "pickupDate": "2026-08-10",
  "pickupSlotId": "uuid",
  "items": [ { "serviceItemId": "uuid", "qtyEstimated": 5 } ],
  "isUnattendedPickup": true,
  "isUnattendedDelivery": true,
  "customerMemo": "와이셔츠 풀 먹여주세요",
  "useSubscription": true
}
→ { "data": { "orderId": "uuid", "orderNo": "JC20260808-0001",
              "estimatedAmount": 25000, "status": "REQUESTED" } }
```

---

## 5. 기사 (`/driver`) 🚚

| Method | Path | 설명 |
|---|---|---|
| GET | `/driver/assignments?date=2026-08-08` | 오늘의 배차 (수거+배송 시간순) |
| GET | `/driver/assignments/:id` | 배차 상세 (주소·연락처·요청사항) |
| POST | `/driver/assignments/:id/start` | 출발 → `ON_THE_WAY` |
| POST | `/driver/assignments/:id/arrive` | 도착 |
| POST | `/driver/assignments/:id/complete` | 완료 (사진·수량·서명) |
| POST | `/driver/assignments/:id/fail` | 실패 (부재 등, 사유+사진) |
| POST | `/driver/factory/checkin` | 공장 입고 (주문번호 QR 다건) |
| POST | `/driver/factory/checkout` | 공장 출고 |
| GET | `/driver/summary?date=` | 일일 처리 요약 |

```jsonc
// POST /driver/assignments/:id/complete   (leg=PICKUP)
Headers: Idempotency-Key: <uuid>
{ "photoKeys": ["orders/2026/08/xxx.webp"], "bagCount": 2, "memo": "" }

// POST /driver/assignments/:id/fail
{ "reason": "ABSENT", "photoKeys": ["..."], "memo": "부재중, 문앞 보관 불가" }
```

---

## 6. 세탁공장 (`/factory`) 🏭

| Method | Path | 설명 |
|---|---|---|
| GET | `/factory/jobs?stage=&date=` | 작업 목록 |
| GET | `/factory/jobs/:id` | 작업 상세 (고객 요청사항·예상 품목) |
| POST | `/factory/jobs/receive` | 입고 처리 (QR 스캔) |
| POST | `/factory/jobs/:id/inspect` | **검수 확정 → 금액 확정** |
| POST | `/factory/jobs/:id/findings` | 특이사항(기존 오염/손상) 등록 |
| PATCH | `/factory/jobs/:id/stage` | 작업 단계 변경 |
| POST | `/factory/jobs/:id/return` | 세탁 불가 반송 |
| GET | `/factory/ready` | 출고 대기 목록 |

```jsonc
// POST /factory/jobs/:id/inspect   ← 시스템에서 가장 중요한 호출
{
  "items": [
    { "serviceItemId": "uuid", "qtyConfirmed": 6 },        // 고객 5 → 실제 6
    { "serviceItemId": "uuid-new", "qtyConfirmed": 1 }     // 고객이 안 적은 품목 추가
  ],
  "findings": [
    { "type": "PRE_EXISTING_STAIN", "description": "왼쪽 소매 기름때",
      "photoKeys": ["..."] }
  ],
  "note": ""
}
→ { "data": { "finalAmount": 31000, "estimatedAmount": 25000,
              "requiresApproval": true, "orderStatus": "AWAITING_APPROVAL" } }
```

---

## 7. 관리자 (`/admin`) 🛠

### 7.1 관제
| Method | Path | 설명 |
|---|---|---|
| GET | `/admin/dashboard` | 당일 지표 (신규/수거/배송/이슈/매출) |
| GET | `/admin/orders?status=&date=&q=&page=` | 전체 주문 검색. **`q` 검색 대상 = 주문번호 · 고객명 · 전화 뒷4자리 · 도로명주소** (상세주소·출입정보는 암호화되어 검색 불가 — 문서 11 §4) |
| GET | `/admin/orders/:id` | 주문 상세 (전체 이력) |
| POST | `/admin/orders/:id/transition` | **강제 상태 변경** (사유 필수) |
| POST | `/admin/orders/:id/adjust-amount` | 금액 조정 (사유 필수) |
| POST | `/admin/orders/:id/cancel` | 취소 + 환불 여부 |
| GET | `/admin/alerts` | SLA 초과·실패 건 목록 |

### 7.2 배차
| Method | Path | 설명 |
|---|---|---|
| GET | `/admin/dispatch/board?date=` | 배차 보드 (기사 × 시간대) |
| GET | `/admin/dispatch/pending?leg=PICKUP` | 미배차 목록 |
| POST | `/admin/dispatch/assign` | 배차 (다건 가능) |
| PATCH | `/admin/dispatch/:id/reassign` | 기사 변경 |
| POST | `/admin/dispatch/auto-suggest` | 자동 배차 제안 (2차) |

### 7.3 마스터 데이터
| Method | Path | 설명 |
|---|---|---|
| GET/POST/PATCH | `/admin/service-items` | 품목·요금 CRUD |
| GET/POST/PATCH | `/admin/service-areas` | 서비스 지역 |
| GET/POST/PATCH | `/admin/time-slots` | 시간 슬롯·정원 |
| GET/POST/DELETE | `/admin/holidays` | 휴무일 |
| GET/POST/PATCH | `/admin/subscription-plans` | 구독 플랜 |

### 7.4 회원 · 정산
| Method | Path | 설명 |
|---|---|---|
| GET | `/admin/customers?q=` | 고객 검색 |
| GET | `/admin/customers/:id` | 고객 상세 (주문 이력·클레임) |
| PATCH | `/admin/customers/:id/status` | 정지/해제 |
| GET/POST/PATCH | `/admin/drivers` | 기사 계정 관리 |
| GET/POST/PATCH | `/admin/factories` | 공장 계정 관리 |
| GET | `/admin/payments?status=&from=&to=` | 결제 내역 |
| GET | `/admin/payments/unpaid` | **미수금 목록** (3회 재시도 실패 건) — 문서 06 §5 |
| POST | `/admin/payments/:id/retry` | 결제 수동 재시도 |
| POST | `/admin/payments/:id/mark-paid` | 계좌이체 등 수동 수납 처리 (사유·증빙 필수) |
| POST | `/admin/payments/:id/refund` | 환불 (부분 가능) |
| GET | `/admin/issues?status=` | 클레임 목록 |
| PATCH | `/admin/issues/:id` | 클레임 처리 |
| GET | `/admin/audit-logs?actorId=&action=` | 감사 로그 |
| GET | `/admin/stats/revenue?from=&to=&groupBy=day` | 매출 통계 (2차) |

---

## 8. 결제 · 구독 (`/billing`, `/subscriptions`) 👤

| Method | Path | 설명 |
|---|---|---|
| POST | `/billing/cards/register-request` | 카드 등록 시작 → PG 위젯용 clientKey/customerKey |
| POST | `/billing/cards/confirm` | authKey → billingKey 발급·저장 |
| GET | `/billing/cards` | 등록 카드 목록 (마스킹) |
| DELETE | `/billing/cards/:id` | 카드 삭제 |
| GET | `/billing/payments` | 내 결제 내역 |
| GET | `/billing/payments/:id/receipt` | 영수증 |
| GET | `/subscriptions/plans` | 플랜 목록 |
| POST | `/subscriptions` | 구독 가입 |
| GET | `/subscriptions/me` | 내 구독 (잔여 횟수·다음 결제일) |
| PATCH | `/subscriptions/me/plan` | 플랜 변경 |
| POST | `/subscriptions/me/cancel` | 해지 (기간 말 해지 / 즉시 해지) |
| POST | `/subscriptions/me/resume` | 해지 예약 취소 |

---

## 9. 웹훅 (`/webhooks`) 🔓 + 서명검증

| Method | Path | 설명 |
|---|---|---|
| POST | `/webhooks/toss` | 결제 상태 변경 (승인/취소/실패) |
| POST | `/webhooks/alimtalk` | 알림톡 발송 결과 |

> 웹훅은 **반드시 서명 검증** 후 처리. 동일 이벤트 재수신 대비 `eventId` 기준 멱등 처리.

---

## 10. 업로드 (`/uploads`) all

| Method | Path | 설명 |
|---|---|---|
| POST | `/uploads/presign` | Presigned PUT URL 발급 (5분 만료) |

```jsonc
{ "purpose": "ORDER_PHOTO", "contentType": "image/webp", "fileSize": 482913 }
→ { "data": { "uploadUrl": "https://s3...", "fileKey": "orders/2026/08/uuid.webp" } }
```

---

## 11. 실시간 (Socket.IO)

**연결:** `wss://api.../socket.io?token=<accessToken>`

| 네임스페이스 | 구독 대상 | 이벤트 |
|---|---|---|
| `/orders` | 고객 (본인 주문 room) | `order.status_changed`, `order.quote_requested` |
| `/dispatch` | 관리자, 기사 | `assignment.created`, `assignment.updated`, `order.alert` |
| `/factory` | 공장 | `job.received`, `job.approved` |

```jsonc
// order.status_changed
{ "orderId": "uuid", "orderNo": "JC20260808-0001",
  "from": "PICKED_UP", "to": "AT_FACTORY", "at": "2026-08-08T11:20:00+09:00" }
```

> WebSocket이 끊겨도 동작해야 하므로 **폴링 폴백**(주문 상세 화면 30초 간격)을 같이 넣는다.
> 실시간은 편의 기능이지 정합성의 원천이 아니다.

---

## 12. 에러 코드 규약

| 코드 | HTTP | 설명 |
|---|---|---|
| `AUTH_UNAUTHORIZED` | 401 | 토큰 없음/만료 |
| `AUTH_FORBIDDEN` | 403 | 역할 권한 없음 |
| `RESOURCE_NOT_FOUND` | 404 | |
| `ORDER_INVALID_TRANSITION` | 409 | 허용되지 않은 상태 전이 |
| `ORDER_VERSION_CONFLICT` | 409 | 동시 수정 충돌 → 재조회 |
| `SLOT_FULL` | 409 | 시간대 정원 초과 |
| `AREA_NOT_SERVICED` | 422 | 서비스 불가 지역 |
| `PAYMENT_FAILED` | 402 | 결제 실패 (PG 사유 포함) |
| `VALIDATION_ERROR` | 400 | 입력값 오류 (`details`에 필드별 메시지) |
| `RATE_LIMITED` | 429 | |
