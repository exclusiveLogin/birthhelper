import * as env from '../../env.js';

export const environment = {
  production: true,
  baseUrl: env['baseUrl'] || 'http://birthhelper.ru/api',
  fileServer: env['fileServer'] || 'http://birthhelper.ru:9080',
  backend: env['backend'] || 'http://birthhelper.ru/api',
  static: env['static'] || 'http://birthhelper.ru/api/static',
};
