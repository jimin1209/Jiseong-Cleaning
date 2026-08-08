# 03. 데이터 모델 (ERD)

## 1. 관계 개요

```
                        ┌──────────┐
                        │  users   │ role: CUSTOMER/DRIVER/FACTORY/ADMIN
                        └────┬─────┘
        ┌───────────────┬────┴────┬────────────────┐
        ▼               ▼         ▼                ▼
customer_profiles  driver_profiles  factory_profiles  admin_profiles
        │               │                │
        │ 1:N           │                │
        ▼               │                │
   addresses            │                │
        │               │                │
        │               │                │
        ▼               ▼                ▼
   ┌─────────────────────────────────────────────┐
   │                  orders                     │◄── subscriptions
   └──┬──────┬────────┬─────────┬────────┬───────┘
      │      │        │         │        │
      ▼      ▼        ▼         ▼        ▼
order_items  assignments  factory_jobs  payments  order_photos
      │                        │                       │
      ▼                        ▼                       ▼
service_items          inspection_items            issues
                                              order_status_history
```

---

## 2. 사용자 · 프로필

### `users`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| phone | text | 로그인 ID. **암호화 저장(AES-256-GCM)** — IV가 매번 달라 같은 번호도 암호문이 달라진다 |
| **phone_hash** | varchar(64) **UNIQUE** | 조회·중복검사용 HMAC-SHA256(pepper). **UNIQUE는 이 컬럼에 건다** |
| **phone_last4** | varchar(4) INDEX | **평문 뒷 4자리.** 관리자 검색·기사 화면 표시용 (문서 11 §4) |
| email | varchar(255) NULL | 관리자/공장용 |
| password_hash | varchar(255) NULL | 기사/공장/관리자만. 고객은 SMS 인증 |
| name | varchar(50) | |
| role | enum | CUSTOMER / DRIVER / FACTORY / ADMIN |
| status | enum | ACTIVE / SUSPENDED / WITHDRAWN |
| failed_login_count | int DEFAULT 0 | 계정 잠금용 (문서 11 §5) |
| locked_until | timestamptz NULL | 잠금 해제 시각 |
| last_login_at | timestamptz NULL | |
| withdrawn_at | timestamptz NULL | 탈퇴 시각. **개인정보는 즉시 비식별화, 거래기록은 5년 보존** ↓ |
| created_at / updated_at | timestamptz | |

> ⚠️ **탈퇴 처리는 "30일 뒤 전부 삭제"가 아니다.** 전자상거래법상 계약·청약철회 기록과
> 대금결제 기록은 **5년 보존 의무**가 있다. 따라서 탈퇴 시:
> - `name`, `phone`, `email`, 주소 → **즉시 파기(비식별 값으로 덮어쓰기)**
> - `orders`, `payments` → **유지**하되 `customer_id`만 남기고 개인정보는 이미 파기된 상태
> - 보존 기간·항목은 문서 11 §7 참조



### `customer_profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| user_id | uuid PK FK→users | |
| default_address_id | uuid NULL FK→addresses | |
| point_balance | int DEFAULT 0 | |
| marketing_agreed | boolean | 알림톡 광고성 수신 동의 |
| memo | text | 관리자용 고객 메모 |

### `driver_profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| user_id | uuid PK FK→users | |
| vehicle_no | varchar(20) | 차량번호 |
| service_area_codes | text[] | 담당 행정동 코드 배열 |
| daily_capacity | int DEFAULT 30 | 일일 처리 가능 건수 (자동배차용) |
| is_on_duty | boolean | 근무 중 여부 |

### `factory_profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| user_id | uuid PK FK→users | |
| factory_name | varchar(100) | |
| address | text | |
| is_internal | boolean | 자사(true) / 외주(false) |
| capacity_per_day | int | |

### `admin_profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| user_id | uuid PK FK→users | |
| level | enum | SUPER_ADMIN / STAFF |

### `addresses`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK→users | |
| label | varchar(20) | 집 / 회사 / 기타 |
| postcode | varchar(10) | |
| **road_address** | text INDEX | **평문.** 도로명주소까지는 개인 식별력이 낮고 관리자·기사 검색에 필수 |
| **detail_address** | text | **암호화(AES-256-GCM).** 동/호수 — 여기부터 개인 식별 |
| **entrance_note** | text | **암호화.** 공동현관 비번 등 — 유출 시 피해가 가장 큰 필드 |
| lat / lng | decimal(10,7) | 배차 거리 계산용 |
| area_code | varchar(10) INDEX | 행정동 코드 → 서비스 지역 판정 |
| is_default | boolean | |
| deleted_at | timestamptz NULL | soft delete (과거 주문이 참조하므로) |

---

## 3. 카탈로그 (마스터 데이터)

### `service_items` — 세탁 품목/요금
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| code | varchar(30) UNIQUE | `SHIRT`, `COAT_DRY`, `BEDDING`, `SHOES` |
| category | enum | WASH(일반) / DRY(드라이) / BEDDING(이불) / SHOES / PREMIUM / **OPTION(추가옵션)** |
| name | varchar(50) | "와이셔츠" |
| unit | enum | PIECE(점) / KG / SET |
| unit_price | int | 원 |
| lead_time_days | int | 표준 소요일 (예상 배송일 계산용) |
| is_active | boolean | |
| sort_order | int | |

### `service_areas` — 서비스 가능 지역
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| area_code | varchar(20) UNIQUE | 행정동 코드 (초기엔 임시 자체 코드, 추후 행정표준코드로 교체) |
| sido / sigungu / dong | varchar | 표시용 |
| **zone** | smallint | 권역 1(시내) / 2(근교) / 3(외곽) — 문서 09 §1.2 |
| **operating_days** | int[] | 이 지역 수거·배송 운영 요일 (1=월 … 7=일) |
| **delivery_lead_days** | int DEFAULT 0 | 권역별 배송 소요일 가산 (1권역 0 / 2권역 +1 / 3권역 +2) |
| aliases | text[] | 구 지명 검색용 (예: 문무대왕면 ← "양북면") |
| is_active | boolean | |
| min_order_amount | int NULL | 지역별 최소 주문금액 |

> **경주는 면적이 넓어(1,324km²) 전 지역을 매일 운영할 수 없다.** 슬롯 조회 시
> `time_slots.weekdays` ∩ `service_areas.operating_days` 교집합만 열어준다. 문서 09 §1.1 참조.

### `time_slots` — 수거/배송 시간대
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| type | enum | PICKUP / DELIVERY |
| start_time / end_time | time | 예 09:00~12:00 |
| capacity | int | 슬롯당 최대 주문 수 |
| weekdays | int[] | 운영 요일 (1=월…7=일) |
| note | varchar(100) | 운영 메모 |
| is_active | boolean | |

> ⚠️ **정원은 기사 용량과 반드시 맞춰야 한다.** PICKUP과 DELIVERY가 별도 행이라
> 같은 시간대의 두 정원이 **합쳐서** 기사 처리량을 넘지 않는지 확인해야 한다.
> 검증식: `Σ capacity(같은 시간대, PICKUP+DELIVERY) ≤ 근무 기사 수 × 15`
> 이 검증을 관리자 슬롯 관리 화면(A-12)에 넣어 초과 저장을 막는다.

### `holidays`
| 컬럼 | 타입 |
|---|---|
| date | date PK |
| reason | varchar(100) |

---

## 4. 주문 (핵심)

### `orders`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| order_no | varchar(20) UNIQUE | `JC20260808-0001` 사용자 표시용 |
| customer_id | uuid FK→users INDEX | |
| subscription_id | uuid NULL FK | 구독 차감 주문이면 연결 |
| status | enum | 문서 04 참조 |
| **pickup_address_id** | uuid FK→addresses | |
| **delivery_address_id** | uuid FK→addresses | 기본은 pickup과 동일 |
| pickup_date | date INDEX | |
| pickup_slot_id | uuid FK→time_slots | |
| delivery_date | date NULL | 검수 후 확정 |
| delivery_slot_id | uuid NULL FK | |
| is_unattended_pickup | boolean | 문앞 수거 |
| is_unattended_delivery | boolean | 문앞 배송 |
| customer_memo | text | |
| factory_id | uuid NULL FK→users | 배정된 공장 |
| **estimated_amount** | int | 고객이 신청 시 예상 금액 |
| **final_amount** | int NULL | 검수 후 확정 금액 |
| discount_amount | int DEFAULT 0 | |
| subscription_covered_amount | int DEFAULT 0 | 구독으로 커버된 금액 |
| payable_amount | int NULL | 실제 청구액 |
| quote_approved_at | timestamptz NULL | 고객이 추가금 승인한 시각 |
| canceled_at / cancel_reason | | |
| **version** | int DEFAULT 0 | **낙관적 잠금용.** 상태 변경 시 `WHERE version = ?` (문서 04 §4.2) |
| created_at / updated_at | | |

**인덱스:** `(customer_id, created_at DESC)`, `(status, pickup_date)`, `(pickup_date, pickup_slot_id)`

### `order_items`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK→orders | |
| service_item_id | uuid FK→service_items | |
| **item_name_snapshot** | varchar(50) | 주문 시점 이름 (요금표 바뀌어도 과거 주문 불변) |
| **unit_price_snapshot** | int | 주문 시점 단가 |
| qty_estimated | int | 고객이 신청한 예상 수량 |
| qty_confirmed | int NULL | 공장 검수 후 확정 수량 |
| amount | int | `unit_price_snapshot × COALESCE(qty_confirmed, qty_estimated)` |
| source | enum | CUSTOMER(고객신청) / FACTORY(검수추가) |

> **스냅샷 필수:** 요금표를 나중에 수정해도 과거 주문 금액이 바뀌면 안 된다.

### `order_status_history`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | bigserial PK | |
| order_id | uuid FK INDEX | |
| from_status / to_status | enum | |
| actor_id | uuid NULL FK→users | 시스템 전이면 NULL |
| actor_role | enum | |
| reason | text NULL | 관리자 강제 변경 시 필수 |
| created_at | timestamptz | |

---

## 5. 배차 (기사)

### `assignments`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK→orders | |
| **leg** | enum | PICKUP / DELIVERY / TO_FACTORY / FROM_FACTORY |
| driver_id | uuid FK→users INDEX | |
| scheduled_date | date INDEX | |
| slot_id | uuid NULL FK→time_slots | |
| sequence | int | 기사 동선 순번 |
| status | enum | ASSIGNED / ON_THE_WAY / ARRIVED / DONE / FAILED |
| started_at / arrived_at / completed_at | timestamptz NULL | |
| fail_reason | enum NULL | ABSENT(부재) / WRONG_ADDR / CUSTOMER_CANCEL / OTHER |
| driver_memo | text | |
| signature_url | text NULL | 대면 배송 서명 |
| **version** | int DEFAULT 0 | 낙관적 잠금 (기사 더블탭 방지) |

**인덱스:** `(driver_id, scheduled_date, sequence)` — 기사 오늘의 목록 조회 핵심

---

## 6. 공장 작업

### `factory_jobs`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK UNIQUE | 주문 1건 = 작업 1건 |
| factory_id | uuid FK→users | |
| received_at | timestamptz NULL | 입고 |
| inspected_at | timestamptz NULL | 검수 완료 |
| stage | enum | RECEIVED / INSPECTING / WASHING / DRYING / PACKING / READY / RETURNED |
| washing_started_at / packed_at / released_at | timestamptz NULL | |
| inspector_note | text | |
| is_returnable | boolean DEFAULT true | 세탁 불가 판정 시 false |
| return_reason | text NULL | |

### `inspection_findings` — 검수 특이사항
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| factory_job_id | uuid FK | |
| type | enum | PRE_EXISTING_STAIN / PRE_EXISTING_DAMAGE / DISCOLORATION / NOT_WASHABLE |
| description | text | |
| photo_urls | text[] | **필수** — 클레임 방어의 핵심 증거 |
| notified_at | timestamptz NULL | 고객 통보 시각 |

---

## 7. 사진 · 이슈

### `order_photos`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK INDEX | |
| stage | enum | PICKUP / FACTORY_IN / INSPECTION / PACKED / DELIVERY |
| file_key | varchar(255) | S3 키 |
| uploaded_by | uuid FK→users | |
| created_at | timestamptz | |
| expires_at | date | 90일 후 삭제 배치 대상 |

### `issues` — 클레임
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK | |
| reported_by | uuid FK→users | |
| type | enum | DAMAGE / LOST / STAIN_REMAIN / DELAY / OTHER |
| severity | enum | LOW / MEDIUM / HIGH |
| description | text | |
| photo_urls | text[] | |
| status | enum | OPEN / IN_REVIEW / RESOLVED / REJECTED |
| resolution_note | text | |
| compensation_amount | int DEFAULT 0 | |
| resolved_by / resolved_at | | |

---

## 8. 결제 · 구독

### `subscription_plans`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| code | varchar(30) UNIQUE | `LIGHT_M`, `STANDARD_M`, `FAMILY_M`, `SHIRT_M` |
| name | varchar(50) | |
| description | varchar(200) | 고객 화면 노출 문구 |
| monthly_price | int | |
| included_count | int | 월 포함 수거 횟수 |
| included_amount_per_use | int NULL | 회당 포함 금액 한도 (초과분 별도 청구) |
| extra_discount_rate | decimal(4,3) | 초과분 할인율 (예 0.100 = 10%) |
| **restricted_item_codes** | text[] NULL | 특정 품목 전용 플랜 (예: 셔츠정기권 = `['SHIRT']`). NULL이면 전 품목 |
| sort_order | int | 화면 노출 순서 |
| is_active | boolean | |

### `subscriptions`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| customer_id | uuid FK INDEX | |
| plan_id | uuid FK | |
| status | enum | ACTIVE / PAST_DUE / PAUSED / CANCELED |
| current_period_start / current_period_end | date | |
| remaining_count | int | 이번 주기 잔여 횟수 |
| billing_key_id | uuid FK→billing_keys | |
| next_billing_at | timestamptz INDEX | Cron이 이 컬럼으로 조회 |
| retry_count | int DEFAULT 0 | 결제 실패 재시도 횟수 |
| canceled_at | timestamptz NULL | |
| cancel_at_period_end | boolean | 해지 예약 (기간 말까지는 사용) |

### `billing_keys` — 카드 등록
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| customer_id | uuid FK | |
| pg_provider | enum | TOSS |
| **billing_key** | text | PG가 준 키 (암호화 저장) |
| card_company | varchar(20) | "신한" — 표시용 |
| card_last4 | varchar(4) | "1234" — 표시용 |
| is_default | boolean | |
| deleted_at | timestamptz NULL | |

> ⚠️ **카드번호 전체·CVC·유효기간은 절대 저장하지 않는다.** PG SDK가 직접 받고 우리는 billingKey만 받는다.

### `payments`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| order_id | uuid NULL FK | 건별 결제 |
| subscription_id | uuid NULL FK | 정기 결제 |
| customer_id | uuid FK INDEX | |
| type | enum | ORDER / SUBSCRIPTION |
| method | enum | CARD / BILLING / TRANSFER / CASH |
| amount | int | |
| status | enum | PENDING / PAID / FAILED / CANCELED / PARTIAL_REFUNDED / REFUNDED |
| pg_payment_key | varchar(200) UNIQUE NULL | PG 거래 키 |
| **idempotency_key** | varchar(100) UNIQUE | 중복 결제 방지 |
| approved_at | timestamptz NULL | |
| failed_reason | text NULL | |
| receipt_url | text NULL | |

### `refunds`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | |
| payment_id | uuid FK | |
| amount | int | 부분환불 가능 |
| reason | text | |
| pg_cancel_key | varchar(200) | |
| status | enum | REQUESTED / DONE / FAILED |
| requested_by | uuid FK→users | |

---

## 9. 알림 · 감사

### `notifications`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | bigserial PK | |
| user_id | uuid FK INDEX | |
| channel | enum | PUSH / KAKAO_ALIMTALK / SMS / IN_APP |
| template_code | varchar(50) | `ORDER_PICKED_UP` 등 |
| payload | jsonb | 치환 변수 |
| status | enum | QUEUED / SENT / FAILED / READ |
| sent_at / read_at | timestamptz NULL | |

### `audit_logs`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | bigserial PK | |
| actor_id | uuid FK→users | |
| action | varchar(50) | `ORDER_STATUS_FORCE_CHANGE`, `AMOUNT_ADJUST`, `CUSTOMER_PII_VIEW` |
| target_type / target_id | varchar / uuid | |
| before / after | jsonb | |
| ip / user_agent | | |
| created_at | timestamptz INDEX | |

---

## 10. 설계 시 지켜야 할 규칙

1. **금액은 항상 `int`(원 단위)** — `float`/`decimal` 금지, 부동소수점 오차 방지
2. **모든 시각은 `timestamptz`**, 앱은 UTC 저장 / KST 표시
3. **스냅샷 원칙** — 주문에 들어간 품목명·단가는 복사해서 저장
4. **Soft delete** — 주소·품목은 과거 주문이 참조하므로 물리 삭제 금지
5. **상태 전이는 반드시 `order_status_history`에 기록** — 트리거 아닌 서비스 레이어에서
6. **암호화는 필드별로 나눈다** — 검색이 필요한 값(도로명주소)은 평문 + 접근통제,
   식별력이 높은 값(상세주소·출입정보·전화번호)만 암호화. 판단 근거는 문서 11 §4
7. **`idempotency_key`** — 결제·상태변경 API는 중복 요청 방어 (기사가 버튼 두 번 누름)
