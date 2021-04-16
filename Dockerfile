FROM alpine:3.12

RUN apk add --no-cache --update nginx nodejs npm git \
    && npm install -g nodemon \
    && chown -R nginx:www-data /var/lib/nginx \
    && mkdir /app

ADD https://github.com/just-containers/s6-overlay/releases/download/v1.21.8.0/s6-overlay-amd64.tar.gz /tmp/

RUN gunzip -c /tmp/s6-overlay-amd64.tar.gz | tar -xf - -C /

ENTRYPOINT ["/init"]

COPY docker_root /
COPY package.json /

RUN npm install --production

WORKDIR /app

EXPOSE 80 443