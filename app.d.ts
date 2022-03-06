import { AppConfigs } from "./src/declarations";

declare module "newer.js/app" {
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