#!/bin/sh
set -e

: "${REVOLT_PUBLIC_URL:?REVOLT_PUBLIC_URL must be set}"

VITE_WS_URL="${VITE_WS_URL:-$(echo "${REVOLT_PUBLIC_URL%%/api*}" | sed "s|^https://|wss://|;s|^http://|ws://|")/ws}"
VITE_MEDIA_URL="${VITE_MEDIA_URL:-${REVOLT_PUBLIC_URL%%/api*}/autumn}"
VITE_PROXY_URL="${VITE_PROXY_URL:-${REVOLT_PUBLIC_URL%%/api*}/january}"

find /usr/share/nginx/html -name "*.js" -exec sed -i \
    -e "s|__VITE_API_URL__|${REVOLT_PUBLIC_URL}|g" \
    -e "s|__VITE_WS_URL__|${VITE_WS_URL}|g" \
    -e "s|__VITE_MEDIA_URL__|${VITE_MEDIA_URL}|g" \
    -e "s|__VITE_PROXY_URL__|${VITE_PROXY_URL}|g" \
    -e "s|__VITE_HCAPTCHA_SITEKEY__|${VITE_HCAPTCHA_SITEKEY:-}|g" \
    -e "s|__VITE_CFG_MAX_FILE_SIZE__|${VITE_CFG_MAX_FILE_SIZE}|g" \
    {} +

exec nginx -g "daemon off;"