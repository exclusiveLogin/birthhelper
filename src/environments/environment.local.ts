// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import * as env from "../../env.js";

export const environment = {
    production: false,
    baseUrl: env["baseUrl"] || "http://localhost:3000",
    fileServer: env["fileServer"] || "http://localhost:3000",
    backend: env["backend"] || "http://localhost:3000",
    static: env["static"] || "http://localhost:3000/static",
    datataSecretKey: "91180214b5687e1ee89069789b440a28f1c638d6",
    dadataAuthorizationKey: "a778bc907289afb630ad4e6a14d99e6f58ba8e47",
};
