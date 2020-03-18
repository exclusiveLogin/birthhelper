import * as env from '../../env.js';

export const environment = {
  production: true,
  baseUrl: env['baseUrl'] || 'http://91.240.87.153',
  fileServer: env['fileServer'] || 'http://91.240.87.153:9080',
  backend: env['backend'] || 'http://91.240.87.153:3000',
  static: env['static'] || 'http://91.240.87.153:3000/static',
};
