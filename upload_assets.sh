#!/bin/sh

VERSION=v1
BUCKET=gs://give.pennywall.io
URL=${BUCKET}

echo Uploading website...
gsutil -m cp -r -a public-read -z html,css,js,sass,hbs themes ${URL}

echo Setting cache headers...
gsutil setmeta -h "Cache-control:public,max-age=3600" -r ${URL}/themes
