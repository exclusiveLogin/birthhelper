// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import * as env from '../../env.js';

export const environment = {
    production: false,
    baseUrl: env['baseUrl'] || 'http://185.178.46.248',
    fileServer: env['fileServer'] || 'http://185.178.46.248:9080',
    backend: env['backend'] || 'http://185.178.46.248:3000',
    static: env['static'] || 'http://185.178.46.248:3000/static',
};
