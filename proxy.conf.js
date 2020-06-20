const PROXY_CONFIG = [
  {
    context: [ '/static' ],
    target: 'http://185.178.46.248:3000',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  }];

module.exports = PROXY_CONFIG;
