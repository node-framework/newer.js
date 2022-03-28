import { AppConfigs, Handler, Middleware } from "./src/declarations";

declare module "newer.js/app" {
    class Application {
        /**
         * Start the app
         * @returns the http or https server
         */
        static start(): Promise<import("http").Server | import("https").Server>

        /**
         * The app configuration
         */
        static readonly appConfig: AppConfigs;

        /**
         * Set app configs
         * @param {import(".").AppConfigs} configs the configs
         */
        static config(configs: AppConfigs): void;
    }

    /**
     * Controller type
     */
    export type NewerController = {
        [route: string]: Handler
    }

    /**
     * Middleware type
     */
    export type NewerMiddleware = Middleware | Middleware[];

    /**
     * Main export
     */
    export = Application;
}