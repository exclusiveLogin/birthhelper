// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import * as env from '../../env.js';

export const environment = {
    production: false,
    baseUrl: env['baseUrl'] || 'http://birthhelper.ru/api',
    fileServer: env['fileServer'] || 'http://birthhelper.ru:9080',
    backend: env['backend'] || 'http://birthhelper.ru/api',
    static: env['static'] || 'http://birthhelper.ru/api/static',
};
