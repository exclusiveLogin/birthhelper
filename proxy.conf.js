const PROXY_CONFIG = [
  {
    context: [ '/static' ],
    target: 'http://185.178.46.248/api',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  },
  {
    context: [ '/api' ],
    target: 'http://185.178.46.248',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
