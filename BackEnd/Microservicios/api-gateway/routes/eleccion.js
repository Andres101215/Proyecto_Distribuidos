const { createProxyMiddleware } = require('http-proxy-middleware');
const ELECCION_SERVICE_URL = process.env.ELECCION_SERVICE_URL;

module.exports = (app) => {
  app.use('/api/elecciones', createProxyMiddleware({
    target: ELECCION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/elecciones': '' }
  }));
};
