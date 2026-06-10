# SignalCraft User Dashboard

## 수정사항

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
