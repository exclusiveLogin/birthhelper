const PROXY_CONFIG = [
  {
    context: [ '/static' ],
    target: 'http://birthhelper.ru/api',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  },
  {
    context: [ '/' ],
    target: 'http://birthhelper.ru',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
