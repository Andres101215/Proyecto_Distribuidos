const { createProxyMiddleware } = require('http-proxy-middleware');
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

module.exports = (app) => {
  app.use('/api/usuarios', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/usuarios': '' }
  }));
};
