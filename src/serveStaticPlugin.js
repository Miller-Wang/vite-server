const path = require('path');
const static = require('koa-static');

function serveStaticPlugin({ app, root }) {
  app.use(static(root));
}

module.exports = serveStaticPlugin;
