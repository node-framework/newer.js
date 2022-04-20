import http from "http";
import https from "https";

/**
 * Server options
 */
export interface SimpleOptions {
    /**
     * Server options
     */
    options?: http.ServerOptions | https.ServerOptions,

    /**
     * Toggle HTTPS mode
     */
    httpsMode?: boolean,

    /**
     * Target port
     */
    port?: number,

    /**
     * Target hostname
     */
    hostname?: string,

    /**
     * Backlog
     */
    backlog?: number
}

/**
 * The simple server
 */
export interface SimpleServer {
    /**
     * The simple HTTP or HTTPS server
     */
    readonly server: http.Server | https.Server;

    /**
     * The generator
     */
    [Symbol.asyncIterator](): AsyncGenerator<http.ServerResponse, any, unknown>;
}
