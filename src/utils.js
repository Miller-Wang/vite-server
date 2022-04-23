const { Readable } = require('stream');

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

module.exports = { readBody };
