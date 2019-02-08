'use strict';

const http2 = require('http2');

const app = require('../discovery/discovery');
const server = http2.createServer({}, app.callback());

if (require.main === module)
  server.listen(8001);
