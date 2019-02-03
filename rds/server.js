'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const StreamRoutes = (stream) => {
  console.log('StreamRoutes API call');
  stream.on('data', (request) => {
    if (request.error_detail)
      console.log(request.error_detail.message);
    else
      console.log(JSON.stringify(request, null, 2));

    fs.readFile('/usr/local/src/response.json', 'utf8', (err, data) => {
      if (err) throw err;
      const response = JSON.parse(data);
      response.nonce = crypto.randomBytes(4).toString('hex');
      response.version_info = Date.now().toString();

      setTimeout(() => {
        console.log(JSON.stringify(response, null, 2));
        stream.write(response);
      }, 5000).unref();
    });
  });
};

const IncrementalRoutes = (call, callback) => {
  console.log(call, callback);
  callback();
};

const FetchRoutes = (call, callback) => {
  console.log(call.request);
  callback(null, {
    resources: []
  });
};

const Server = (port = 8001, ip = '0.0.0.0') => {
  const proto = path.resolve(
    __dirname,
    '..',
    'node_modules',
    'envoy-data-plane-api',
    'envoy',
    'api',
    'v2',
    'rds.proto'
  );

  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
      path.resolve(__dirname, '..', 'node_modules', 'envoy-data-plane-api')
    ]
  };

  const packageDefinition = protoLoader.loadSync(proto, options);
  const pb = grpc.loadPackageDefinition(packageDefinition).envoy.api.v2;

  const server = new grpc.Server();
  const implementation = {
    StreamRoutes,
    IncrementalRoutes,
    FetchRoutes
  };

  server.addService(pb.RouteDiscoveryService.service, implementation);
  server.bind(`${ip}:${port}`, grpc.ServerCredentials.createInsecure());
  return server;
};

if (require.main === module) {
  const server = Server(process.env.PORT, process.env.IP);
  server.start();
  process.on('SIGTERM', () => server.forceShutdown());
}
