FROM ghcr.io/uoft-utsc-cs-sandbox/unihub/base:latest AS builder
#FROM my-base-image:nx-base AS builder


ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder
COPY . /app/builder
RUN npx nx run webapp:build:production

FROM nginx:1.23.0-alpine

WORKDIR /usr/share/nginx/html

EXPOSE 80

COPY --from=builder /app/builder/dist/apps/webapp /usr/share/nginx/html/

