const PROXY_CONFIG = [
    {
        context: ['/api/*'],
        target: 'http://localhost:3000/api/*',
        changeOrigin: true,
        logLevel: "debug",
        secure: false
    }
];

module.exports = PROXY_CONFIG; 