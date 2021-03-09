import * as env from '../../env.js';

export const environment = {
  production: true,
  baseUrl: env['baseUrl'] || 'http://birthhelper.ru',
  fileServer: env['fileServer'] || 'http://birthhelper.ru:9080',
  backend: env['backend'] || 'http://birthhelper.ru:3000',
  static: env['static'] || 'http://birthhelper.ru:3000/static',
};
