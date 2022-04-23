const path = require('path');
const { parse, compileScript, compileTemplate, rewriteDefault } = require('@vue/compiler-sfc');
const fs = require('fs').promises;

const descriptorCache = new Map();

function vuePlugin({ root, app }) {
  app.use(async (ctx, next) => {
    if (!ctx.path.endsWith('.vue')) {
      return await next();
    }
    // 处理vue文件
    const filePath = path.join(root, ctx.path);
    const { descriptor } = await getDescriptor(filePath);

    // url参数type是style说明是样式文件，通过脚本方式插入head中
    if (ctx.query.type === 'style') {
      // 处理样式
      ctx.type = 'js';
      const block = descriptor.styles[ctx.query.index];
      ctx.body = `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(block.content)};
        document.head.appendChild(style);
      `;
      return;
    }

    // 组装代码
    let targetCode = '';

    // 处理样式，在返回的vue文件中插入引入样式的语句
    if (descriptor.styles.length > 0) {
      let styleCodes = '';
      descriptor.styles.forEach((style, index) => {
        const styleRequest = `${ctx.path}?vue&type=style&index=${index}&lang.css`;
        styleCodes += `\nimport ${JSON.stringify(styleRequest)}`;
      });
      targetCode += styleCodes;
    }

    // 处理脚本
    if (descriptor.script) {
      let scriptCode = compileScript(descriptor, { reactivityTransform: false });
      scriptCode = rewriteDefault(scriptCode.content, '_sfc_main');
      targetCode += scriptCode;
    }

    // 处理模版
    if (descriptor.template) {
      let { code } = compileTemplate({ source: descriptor.template.content });
      targetCode += code;
    }

    targetCode += `\n_sfc_main.render = render;\nexport default _sfc_main;`;
    ctx.type = 'js';
    ctx.body = targetCode;
  });
}

async function getDescriptor(filePath) {
  if (descriptorCache.has(filePath)) {
    return descriptorCache.get(filePath);
  }

  const content = await fs.readFile(filePath, 'utf8');
  const descriptor = parse(content);
  descriptorCache.set(filePath, descriptor);
  return descriptor;
}

module.exports = vuePlugin;
