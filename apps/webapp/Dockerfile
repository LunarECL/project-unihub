FROM ghcr.io/uoft-utsc-cs-sandbox/unihub/base:latest AS builder
#FROM my-base-image:nx-base AS builder


ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder
COPY . /app/builder
RUN npx nx run webapp:build:production

FROM jwilder/nginx-proxy:latest

COPY --from=builder /app/builder/dist/apps/webapp /usr/share/nginx/html/

COPY --from=builder /app/builder/apps/webapp/nginx.conf /etc/nginx/conf.d/default.conf
