const { Readable } = require('stream');
const path = require('path');

/**
 * 将ctx.body转为字符串
 * @param {*} stream
 * @returns
 */
async function readBody(stream) {
  if (stream instanceof Readable) {
    return new Promise((resolve) => {
      let buffers = [];
      stream
        .on('data', (chunk) => buffers.push(chunk))
        .on('end', () => {
          let result = Buffer.concat(buffers).toString();
          resolve(result);
        });
    });
  } else {
    return stream.toString();
  }
}

async function resolveVue(root) {
  const resolvePath = (moduleName) =>
    path.join(root, `/node_modules/@vue/${moduleName}/dist/${moduleName}.esm-bundler.js`);
  return {
    vue: resolvePath('runtime-dom'),
    '@vue/shared': resolvePath('shared'),
    '@vue/reactivity': resolvePath('reactivity'),
    '@vue/runtime-core': resolvePath('runtime-core'),
  };
}

module.exports = { readBody, resolveVue };
