#!/bin/sh
cat > /usr/share/nginx/html/env.js <<EOF
window.__SIGNALCRAFT_CONFIG__ = {
  "VITE_API_URL": "${VITE_API_URL}",
  "VITE_USE_MOCK_API": "${VITE_USE_MOCK_API:-false}",
  "VITE_X_AUTH_ID": "${VITE_X_AUTH_ID}",
  "VITE_X_AUTH_PROVIDER": "${VITE_X_AUTH_PROVIDER}",
  "VITE_X_CUSTOMER_ID": "${VITE_X_CUSTOMER_ID}",
  "VITE_PLACE_ID": "${VITE_PLACE_ID}",
  "VITE_APP_TITLE": "${VITE_APP_TITLE:-SignalCraft}",
  "VITE_CLIENT_THEME_ID": "${VITE_CLIENT_THEME_ID}"
};
EOF
exec "$@"
