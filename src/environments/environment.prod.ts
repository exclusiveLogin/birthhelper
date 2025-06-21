import * as env from "../../env.js";

export const environment = {
    production: true,
    baseUrl: env["baseUrl"] || "/api",
    fileServer: env["fileServer"] || "/files",
    backend: env["backend"] || "/api",
    static: env["static"] || "/api/static",
    datataSecretKey: "91180214b5687e1ee89069789b440a28f1c638d6",
    dadataAuthorizationKey: "a778bc907289afb630ad4e6a14d99e6f58ba8e47",
};
