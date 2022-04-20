import http from "http";
import https from "https";

/**
 * App configs
 */
export interface AppConfigs {
    /**
     * App root path. Defaults to "."
     */
    projectPath?: string,

    /**
     * Static directory. Defaults to "public"
     */
    static?: string,

    /**
     * HTTP server options
     */
    httpOptions?: {
        /**
         * Server port. Defaults to 80
         */
        port?: number,

        /**
         * Server hostname. Defaults to "localhost"
         */
        hostname?: string,

        /**
         * HTTPS mode. Defaults to false
         */
        httpsMode?: boolean,

        /**
         * HTTP backlog. Defaults to 0
         */
        backlog?: number,

        /**
         * Advanced options
         */
        advanced?: http.ServerOptions | https.ServerOptions
    }
}
