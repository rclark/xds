'use strict';

const http2 = require('http2');

const clusters = [
  {
    '@type': 'type.googleapis.com/envoy.api.v2.Cluster',
    name: 'service_google',
    connect_timeout: { seconds: 10 },
    type: 'LOGICAL_DNS',
    lb_policy: 'ROUND_ROBIN',
    tls_context: { sni: 'www.google.com' },
    dns_lookup_family: 'V4_ONLY',
    hosts: [
      { socket_address: { address: 'www.google.com', port_value: 443 } }
    ]
  }
];

const route_configs = {
  'listener_0_for_google': {
    '@type': 'type.googleapis.com/envoy.api.v2.RouteConfiguration',
    name: 'listener_0_for_google',
    virtual_hosts: [
      {
        name: 'google_host',
        domains: ['*'],
        routes: [
          {
            match: { prefix: '/' },
            route: { host_rewrite: 'www.google.com', cluster: 'service_google' }
          }
        ]
      }
    ]
  }
};

const request_handlers = {
  'POST /v2/discovery:clusters': (stream, body) => {
    const { node: { id, cluster } } = JSON.parse(body);

    console.log(`clusters request from ${cluster}:${id}`);

    stream.respond({
      ':status': 200,
      'content-type': 'application/json'
    });

    stream.end(JSON.stringify({ resources: clusters }));
  },

  'POST /v2/discovery:routes': (stream, body) => {
    const { node: { id, cluster }, resource_names } = JSON.parse(body);

    console.log(`routes request for ${resource_names.join(', ')} from ${cluster}:${id}`);

    stream.respond({
      ':status': 200,
      'content-type': 'application/json'
    });

    stream.end(JSON.stringify({
      resources: resource_names.map((name) => route_configs[name])
    }));
  }
};

const server = http2.createServer();

server.on('stream', (stream, headers) => {
  const { ':method': method, ':path': path } = headers;

  let body = '';
  stream
    .on('data', (d) => body += d)
    .on('end', () => request_handlers[`${method} ${path}`](stream, body));
});

server.listen(8001);
