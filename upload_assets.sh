#!/bin/sh

VERSION=v1
BUCKET=gs://give.pennywall.io
URL=${BUCKET}

echo Uploading website...
gsutil -h "Cache-control:public,max-age=3600" -m cp -r -a public-read -z html,css,js,sass,hbs themes ${URL}
