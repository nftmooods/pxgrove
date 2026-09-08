#!/usr/bin/env bash
# Deploys dist/index.html to Hostinger over FTP(S). Credentials come from .env (never committed):
#   FTP_HOST=ftp.example.com  FTP_USER=u123456  FTP_PASS=...  FTP_DIR=/public_html
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env ] && set -a && . ./.env && set +a
: "${FTP_HOST:?set FTP_HOST in .env}" "${FTP_USER:?}" "${FTP_PASS:?}" "${FTP_DIR:=/public_html}"
node build/build.mjs "$@"
curl --ssl-reqd --ftp-create-dirs -T dist/index.html "ftp://${FTP_HOST}${FTP_DIR}/index.html" --user "${FTP_USER}:${FTP_PASS}"
echo "deployed dist/index.html → ${FTP_HOST}${FTP_DIR}/index.html"
