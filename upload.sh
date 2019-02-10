#!/bin/sh

VERSION=v1
BUCKET=gs://give.pennywall.io
URL=${BUCKET}
LINK=$1

if [ "$LINK" == "" ]; then
  echo Usage: $0 link
  echo "  path: https://give.pennywall.io/LINK"
  exit
fi

echo Uploading website...
gsutil -m cp -r -a public-read -z html,css,js build/* ${URL}/${LINK}

echo Setting cache headers...
gsutil setmeta -h "Cache-control:public,max-age=120" -r ${URL}/${LINK}
gsutil web set -m index.html -e index.html ${BUCKET}
