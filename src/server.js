const Koa = require('koa');
const serveStaticPlugin = require('./serveStaticPlugin');
const moduleRewritePlugin = require('./moduleRewritePlugin');

function createServer() {
  const app = new Koa();
  const root = process.cwd();
  const context = { app, root };

  // 内部使用app.use注册中间件
  [moduleRewritePlugin, serveStaticPlugin].forEach((plugin) => plugin(context));

  return app;
}

createServer().listen(4000, async () => {
  console.log(`vite running at: http://localhost:4000`);
});
