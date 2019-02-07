'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// const Router = require('koa-router');

const app = new Koa();
// const router = new Router();

app.use(bodyParser({ enableTypes: ['json'] }));

app.use(async (ctx) => {
  // POST
  // /v2/discovery:clusters
  // {
  //   node: {
  //     id: 'node-a',
  //     cluster: 'cluster-a',
  //     build_version: '58185a427af9beac09fa16fcaf663ddd051b2c11/1.10.0-dev/Clean/RELEASE/BoringSSL'
  //   }
  // }
  console.log(ctx.request.url);
  console.log(JSON.stringify(ctx.request.body, null, 2));

  ctx.status = 200;
  ctx.body = {
    resources: [
      {
        '@type': 'type.googleapis.com/envoy.api.v2.Cluster',
        name: 'service_google',
        connect_timeout: { seconds: 10 },
        type: 'LOGICAL_DNS',
        lb_policy: 'ROUND_ROBIN',
        tls_context: { sni: 'www.google.com' },
        dns_lookup_family: 'V4_ONLY',
        hosts: [
          {
            socket_address: {
              address: 'www.google.com',
              port_value: 443
            }
          }
        ]
      }
    ]
  };
});

app.listen(8001);


