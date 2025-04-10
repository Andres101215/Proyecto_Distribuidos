const { createProxyMiddleware } = require('http-proxy-middleware');
const VOTO_SERVICE_URL = process.env.VOTO_SERVICE_URL;

module.exports = (app) => {
  app.use('/api/votos', createProxyMiddleware({
    target: VOTO_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/votos': '' }
  }));
};
