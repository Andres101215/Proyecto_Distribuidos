const { createProxyMiddleware } = require('http-proxy-middleware');
const AUDITORIA_SERVICE_URL = process.env.AUDITORIA_SERVICE_URL;

module.exports = (app) => {
  app.use('/api/auditoria', createProxyMiddleware({
    target: AUDITORIA_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auditoria': '' }
  }));
};
