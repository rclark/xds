FROM node:8

ENV IP=0.0.0.0
ENV PORT=8001

WORKDIR /usr/local/src/xds

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci --production

COPY ./discovery/discovery.js ./discovery/discovery.js

CMD node ./discovery/discovery.js
