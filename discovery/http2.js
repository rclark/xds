'use strict';

const http2 = require('http2');

const app = require('./app');

http2
  .createServer({}, app.callback())
  .listen(8001);
