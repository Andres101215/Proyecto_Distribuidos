const { createProxyMiddleware } = require('http-proxy-middleware');
const CANDIDATE_SERVICE_URL = process.env.CANDIDATE_SERVICE_URL;

module.exports = (app) => {
  app.use('/api/candidatos', createProxyMiddleware({
    target: CANDIDATE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/candidatos': '' }
  }));
};
