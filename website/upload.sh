#!/bin/sh

BUCKET=gs://www.pennywall.io
URL=${BUCKET}

echo Uploading website...
gsutil -m cp -a public-read -z html,css,js index.html index.css ${URL}
gsutil -m cp -r -a public-read -z html,css,js assets/* ${URL}/assets
gsutil setmeta -h "Cache-control:public,max-age=120" -r ${URL}
gsutil web set -m index.html -e index.html ${BUCKET}
