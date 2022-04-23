const { readBody } = require('./utils');
const MagicString = require('magic-string');
const { parse } = require('es-module-lexer');
const hash = require('hash-sum');
const path = require('path');

/**
 * 重写从node_moduels中引入的模块
 * import xxx from 'vue';  =>  import xxx from '/node_modules/.vite/deps/xx';
 * @param {*} param0
 */
function moduleRewritePlugin({ root, app }) {
  app.use(async (ctx, next) => {
    // 等静态文件中间件处理完，下面获取内容
    await next();
    // js文件才处理
    if (ctx.body && ctx.response.is('.js')) {
      const relativePath = path.relative(root, ctx.path);
      // 获取文件内容
      const bodyContent = await readBody(ctx.body);
      // 处理从node_modules中 import 的路径
      const rewriteBodyContent = await rewriteImports(bodyContent, relativePath);
      ctx.body = rewriteBodyContent;
    }
  });
}

// 重写import路径
async function rewriteImports(bodyContent, relativePath) {
  const imports = await parse(bodyContent);
  const magicString = new MagicString(bodyContent);
  if (imports && imports[0].length > 0) {
    imports[0].forEach(({ n, s, e }) => {
      // s 开始位置
      // e 结束位置
      // n 引入模块
      // 如果导入的文件不是以 . 或者 / 开头的才会重写
      if (/^[^\/\.]/.test(n)) {
        magicString.overwrite(s, e, `/node_modules/.vite/deps/${n}.js?v=${hash(relativePath)}`);
      }
    });
  }
  return magicString.toString();
}

module.exports = moduleRewritePlugin;
