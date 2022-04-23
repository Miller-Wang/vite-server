const Koa = require('koa');
const static = require('koa-static');

function createServer() {
  const app = new Koa();
  const root = process.cwd();
  const context = { app, root };
  // 1.静态文件服务
  app.use(static(root));

  return app;
}

createServer().listen(4000, async () => {
  console.log(`vite running at: http://localhost:4000`);
});
