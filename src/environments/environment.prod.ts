import * as env from '../../env.js';

export const environment = {
  production: true,
  baseUrl: env['baseUrl'] || 'http://185.178.46.248',
  fileServer: env['fileServer'] || 'http://185.178.46.248:9080',
  backend: env['backend'] || 'http://185.178.46.248:3000',
  static: env['static'] || 'http://185.178.46.248:3000/static',
};
