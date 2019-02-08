FROM node:10-alpine

ENV IP=0.0.0.0
ENV PORT=8001

WORKDIR /usr/local/src/xds

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci --production

COPY ./discovery/discovery.js ./discovery/discovery.js
COPY ./http2/server.js ./http2/server.js

CMD node ./http2/server.js
