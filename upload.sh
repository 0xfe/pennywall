#!/bin/sh

VERSION=v1
BUCKET=gs://give.pennywall.io
URL=${BUCKET}

npm run build

echo Uploading website...
gsutil -m cp -a public-read -z html,css,js build/* ${URL}/kevsveganblog
gsutil -m cp -a public-read -z html,css,js assets/* ${URL}/assets

echo Setting cache headers...
gsutil setmeta -h "Cache-control:public,max-age=120" -r ${URL}
gsutil web set -m index.html -e index.html ${BUCKET}