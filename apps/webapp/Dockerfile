FROM ghcr.io/UofT-UTSC-CS-sandbox/unihub/base:latest AS builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder
COPY . /app/builder
RUN npx nx run webapp:build:production

FROM nginx:1.23.0-alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/builder/dist/apps/webapp /usr/share/nginx/html/

COPY --from=builder /app/builder/apps/webapp/nginx.conf /etc/nginx/nginx.conf
