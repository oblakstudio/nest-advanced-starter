FROM node:20-alpine as build

RUN apk add --no-cache jq

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node src ./src
COPY --chown=node:node package* ./
COPY --chown=node:node tsconfig* ./
COPY --chown=node:node nest-cli* ./

ENV NODE_ENV=development
RUN npm ci
RUN npm run build:prod
RUN rm -rf src
RUN rm -rf node_modules
RUN jq 'del(.devDependencies)' package.json > tmp.json && mv tmp.json package.json


FROM node:20-alpine as production

LABEL org.opencontainers.image.source="https://github.com/oblakhost/redis-manager"
LABEL org.opencontainers.image.authors="Oblak Studio <support@oblak.studio>"
LABEL org.opencontainers.image.title="Redis Docker Manager"
LABEL org.opencontainers.image.description="Docker Optimized"
LABEL org.opencontainers.image.licenses="MIT"

RUN apk add --no-cache tzdata
ENV TZ=Europe/Belgrade
RUN cp /usr/share/zoneinfo/Europe/Belgrade /etc/localtime

USER node

ENV NODE_ENV=production

COPY --from=build --chown=node:node /home/node/app /home/node/app
WORKDIR /home/node/app
RUN mkdir /home/node/config
RUN mkdir /home/node/data
RUN npm ci

EXPOSE 5000

ENV TERM xterm-256color


CMD ["node", "dist/main"]
