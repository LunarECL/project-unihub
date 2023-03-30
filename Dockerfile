# base image used by all apps
FROM node:lts-alpine3.17 AS builder

WORKDIR /app/builder

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

# Only copy dependencies - Source files aren't necessary
COPY package*.json /app/builder/

RUN yarn
