'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(bodyParser({ enableTypes: ['json'] }));

app.use((ctx, next) => {
  let msg = `${ctx.request.method} ${ctx.request.url} from ${ctx.request.body.node.cluster}:${ctx.request.body.node.id}`;
  if (ctx.request.body.resource_names)
    msg += ` | requested: ${ctx.request.body.resource_names.join(', ')}`;
  console.log(msg);
  next();
});

router

  .post('/v2/discovery\\:clusters', async (ctx) => {
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

module.exports = app;


