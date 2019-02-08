'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(bodyParser({ enableTypes: ['json'] }));

router

  .post('/v2/discovery\\:clusters', async (ctx) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    console.log(`cluster: ${ctx.request.body.node.cluster} | node: ${ctx.request.body.node.id}`);
    if (ctx.request.body.resource_names)
      console.log(`requested resources: ${ctx.request.body.resource_names.join(', ')}`);

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
  })

  .post('/v2/discovery\\:routes', async (ctx) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    console.log(`cluster: ${ctx.request.body.node.cluster} | node: ${ctx.request.body.node.id}`);
    if (ctx.request.body.resource_names)
      console.log(`requested resources: ${ctx.request.body.resource_names.join(', ')}`);

    ctx.status = 200;
    ctx.body = {
      resources: [
        {
          '@type': 'type.googleapis.com/envoy.api.v2.RouteConfiguration',
          name: 'listener_0_for_google',
          virtual_hosts: [
            {
              name: 'google_host',
              domains: ['*'],
              routes: [
                {
                  match: { prefix: '/' },
                  route: {
                    host_rewrite: 'www.google.com',
                    cluster: 'service_google'
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  });

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8001);


