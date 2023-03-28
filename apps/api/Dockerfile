FROM ghcr.io/uoft-utsc-cs-sandbox/unihub/base:latest AS builder
#FROM my-base-image:nx-base AS builder

# Production Build
WORKDIR /app/builder
COPY . /app/builder
RUN npx nx run api:build:production \
    && npm prune --production

# Multi stage build step
# Fresh node image
FROM node:lts-alpine3.17

WORKDIR /app
COPY --from=builder /app/builder /app/
ENV NODE_ENV production


CMD [ "node", "./dist/apps/api/main.js" ]
