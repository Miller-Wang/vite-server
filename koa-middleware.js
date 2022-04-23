// koa中间件执行顺序
const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next) => {
  console.log('中间件一');
  await next();
  console.log('中间件一 执行完成');
});

app.use(async (ctx, next) => {
  console.log('中间件二');
  await next();
  console.log('中间件二 执行完成');
});

app.use(async (ctx, next) => {
  console.log('中间件三');
  await next();
  console.log('中间件三 执行完成');
});

app.use(async (ctx, next) => {
  console.log('中间件四');
  await next();
  console.log('中间件四 执行完成');
});

app.listen(4100);
