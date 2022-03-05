import Server from "./src/Server/server";
import Router from "./src/Middleware/router";
import StaticDir from "./src/Middleware/staticdir";
import simple from "./src/Server/simple";
import SubDomain from "./src/Middleware/subdomain";
import Cookie from "./src/Middleware/cookie";
import JsonDB from "./src/Database/JsonDB";
import { AppConfigs } from "./src/declarations";

declare module "newer.js" {
    export {
        Server,
        Router,
        StaticDir,
        simple,
        SubDomain,
        Cookie,
        JsonDB,
    }

    export * from "./src/declarations";
}

declare module "newer.js/application" {
    class Application {
        /**
         * Create a new application
         * @param appConfig the app configuration
         */
        constructor(appConfig: AppConfigs);

        /**
         * Start the app
         * @returns the http or https server
         */
        start(): Promise<import("http").Server | import("https").Server>

        /**
         * The app configuration
         */
        readonly appConfig: AppConfigs;

        /**
         * Set app configs
         * @param {import(".").AppConfigs} configs the configs
         */
        config(configs: AppConfigs): void;
    }

    export = Application;
}