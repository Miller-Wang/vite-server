const Koa = require('koa');
const serveStaticPlugin = require('./serveStaticPlugin');
const moduleRewritePlugin = require('./moduleRewritePlugin');
const moduleResolvePlugin = require('./moduleResolvePlugin');
const vuePlugin = require('./vuePlugin');

function createServer() {
  const app = new Koa();
  const root = process.cwd();
  const context = { app, root };

  // 内部使用app.use注册中间件
  [moduleRewritePlugin, moduleResolvePlugin, vuePlugin, serveStaticPlugin].forEach((plugin) => plugin(context));

  return app;
}

createServer().listen(4000, async () => {
  console.log(`vite running at: http://localhost:4000`);
});
