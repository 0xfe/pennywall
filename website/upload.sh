#!/bin/sh

BUCKET=gs://www.pennywall.io
URL=${BUCKET}

echo Uploading website...
gsutil -h "Cache-control:public,max-age=600" -m cp -a public-read -z html,css,js index.html index.css ${URL}
gsutil -h "Cache-control:public,max-age=600" -m cp -r -a public-read -z html,css,js assets/* ${URL}/assets
