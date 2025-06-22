const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://birthhelper.ru',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
