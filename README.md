# SignalCraft User Dashboard

> [!NOTE]
> 수정사항 작성일 : 2026-06-10

### UI

- **하단 푸터(BottomNav) hidden 처리**
> [!INFO]
> `src/components/shared/BottomNav.tsx`에서 `return null` 처리. 전체 페이지 일괄 적용됨. 재활성화 시 해당 줄 제거.

- **다음 버전을 위한 렌더링 초기화**
> [!INFO]
> `/dashboard` 외 페이지(`MachinePage`, `ReportPage`, `SettingsPage`)를 `return null` blank로 처리. 기존 코드는 각 파일 하단 주석으로 보존. 재활성화 시 주석 해제 후 상단 export 함수 교체.

- **Header 알림 기능 주석 처리**
> [!INFO]
> `src/components/shared/Header.tsx`에서 notifications 관련 import, useQuery, 버튼 UI, `NotificationModal`/`UserProfileModal` 마운트를 모두 주석 처리. 로고 링크만 렌더링하는 최소 상태로 유지. 재활성화 시 주석 해제.

- **설비 아이콘 단일화**
> [!INFO]
> `src/lib/machineIcons.tsx`의 타입별 분기 제거. 실 API `machine_code`가 카테고리가 아닌 개별 코드명이라 구분 불가. 전체 `Gauge` 아이콘으로 통일. 백엔드에 타입 필드 추가 시 매핑 로직 복구 가능.

### API 연결

- **Dashboard 진입 조건 변경 — `/me` 기반으로 전환**
> [!INFO]
> 기존 `/dashboard/home` useQuery 제거. `/me` 응답 완료 시 대시보드 렌더링. `HomeGreeting`의 이름 표시를 `me.customer.name` 기반으로 변경. `userProfileAdapter`에 `primary_technician_phone`, `primary_technician_name` 필드 추가.

- **StatusOverviewSection — `/machines` 기반으로 재연결**
> [!INFO]
> `/machines` 응답에서 `operational_state`를 집계해 설비 카드 1개 표시. 상태 판단: 1개 이상 `running` → 가동중(초록), 전부 0 + error/unknown 없음 → 중지(노랑), 전부 0 + error/unknown 존재 → 연결상태 에러(빨강).

- **EquipmentSummarySection — `/machines` 기반으로 재연결**
> [!INFO]
> `/machines` 응답을 `EquipmentSummaryItem[]`으로 매핑. `operational_state === 'running'` → RUNNING, 그 외 → OFF. `/machines` 단일 호출로 StatusOverviewSection과 동시 처리.

- **MaintenanceCallButton — `/me` 기반으로 재연결**
> [!INFO]
> 기존 `/dashboard/home.maintenancePhone` 대신 `me.technicians`의 `is_primary: true` 정비사 전화번호 사용. 모바일/데스크톱 구분 제거, 항상 팝업으로 동작. 팝업 헤더에 정비사 이름 표시.

### 배포

- **Cloud Run Service 배포 구성**
> [!INFO]
> `Dockerfile`(nginx 멀티스테이지), `nginx.conf`, `entrypoint.sh`(런타임 env.js 주입), `.github/workflows/deploy.yml` 추가. GHCR 빌드 → GAR 복사 → Cloud Run Service 배포. `v001-dev` 브랜치 push 시 자동 실행.

- **`index.html`에 `env.js` 로드 추가**
> [!ERROR]
> 초기 배포 시 `window.__SIGNALCRAFT_CONFIG__`가 설정되지 않아 mock 모드로 동작. `index.html`에 `<script src="/env.js"></script>` 추가로 해결. 앱 번들보다 먼저 로드되어야 런타임 config가 적용됨.
