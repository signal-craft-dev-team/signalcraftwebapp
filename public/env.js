// Runtime config injection (Cloud Run 정적 컨테이너용).
// nginx 컨테이너 entrypoint에서 환경변수를 읽어 이 객체를 덮어쓴 뒤 서빙합니다.
// Vite 빌드 결과물은 build-time env를 그대로 inline 하므로, 컨테이너 런타임에서
// 값을 바꾸려면 이 객체에 키를 채워 넣으세요.
//
// 채워야 하는 키 (.env.example 참조):
//   VITE_API_URL
//   VITE_X_AUTH_ID / VITE_X_AUTH_PROVIDER / VITE_X_CUSTOMER_ID / VITE_PLACE_ID
//   VITE_USE_MOCK_API
//   VITE_APP_TITLE / VITE_CLIENT_THEME_ID
//   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
window.__SIGNALCRAFT_CONFIG__ = {};
