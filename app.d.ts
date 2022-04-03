import { AppConfigs, Middleware } from "./src/declarations";

declare namespace Application {
    /**
     * Start the app
     * @returns the http or https server
     */
    export function start(): Promise<import("http").Server | import("https").Server>

    /**
     * The app configuration
     */
    export const appConfig: AppConfigs;

    /**
     * Set app configs
     * @param {import(".").AppConfigs} configs the configs
     */
    export function config(configs: AppConfigs): void;

    /**
     * Middleware type
     */
    export type NewerMiddleware = Middleware | Middleware[];
}

/**
 * Main export
 */
export = Application;