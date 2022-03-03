/// <reference types="node" />
import { AppConfigs } from "../declarations.js";
declare class Application {
    constructor();
    readonly appConfig: AppConfigs;
    /**
     * Start the app
     * @returns the http or https server
     */
    start(): Promise<import("http").Server | import("https").Server>;
    /**
      * Set app configs
      * @param configs the configs
      */
    config(configs: AppConfigs): void;
}
declare const app: Application;
export default app;
