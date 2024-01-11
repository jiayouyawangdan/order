const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'http://192.168.31.27:8383',
      changeOrigin: true,
    })
  );
};
