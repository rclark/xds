'use strict';

const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

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

const client = new pb.RouteDiscoveryService('localhost:8001', grpc.credentials.createInsecure());

const stream = client.StreamRoutes();

const request = {
  resource_names: ['listener_0_for_google'],
  version_info: '',
  node: {
    id: 'node-a',
    cluster: 'cluster-a',
    metadata: null,
    locality: null,
    build_version: '58185a427af9beac09fa16fcaf663ddd051b2c11/1.10.0-dev/Clean/RELEASE/BoringSSL'
  },
  type_url: 'type.googleapis.com/envoy.api.v2.RouteConfiguration',
  response_nonce: '',
  error_detail: null
};

stream.write(request);
stream.once('data', (data) => {
  console.log(JSON.stringify(data, null, 2));
  stream.end();
});
