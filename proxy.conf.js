const PROXY_CONFIG = [
  {
    context: ['/static'],
    target: 'http://localhost:3000/api',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  },
  {
    context: ['/'],
    target: 'http://localhost:3000',
    changeOrigin: true,
    logLevel: "debug",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
