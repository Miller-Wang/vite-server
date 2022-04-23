const moduleRegxp = /\/node_modules\/.vite\/deps\/(.+?).js/;

const { resolveVue } = require('./utils');
const fs = require('fs').promises;
const path = require('path');

function moduleResolvePlugin({ app, root }) {
  app.use(async (ctx, next) => {
    // 此中间价只处理/node_modules下的模块
    if (!moduleRegxp.test(ctx.path)) {
      return await next();
    }
    const moduleId = ctx.path.match(moduleRegxp)[1];
    const vueResolved = await resolveVue(root);
    // const modulePath = vueResolved[moduleId];

    // 读取esbuild预构建的依赖 /node_modules/.vite/deps
    const modulePath = path.join(root, ctx.path);

    const moduleContent = await fs.readFile(modulePath, 'utf8');
    ctx.type = 'js';
    ctx.body = moduleContent;
  });
}

module.exports = moduleResolvePlugin;
