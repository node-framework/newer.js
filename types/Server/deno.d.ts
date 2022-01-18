/// <reference types="node" />
import https from "https";
import http from "http";
export interface SimpleOptions {
    /**
     * Server options
     */
    options?: http.ServerOptions | https.ServerOptions;
    /**
     * Toggle HTTPS mode
     */
    httpsMode?: boolean;
    /**
     * Target port
     */
    port?: number;
    /**
     * Target hostname
     */
    hostname?: string;
    /**
     * Backlog
     */
    backlog?: number;
}
/**
 * Create a simple server
 */
export default function (opts?: SimpleOptions): AsyncGenerator<{
    request: http.IncomingMessage;
    response: http.ServerResponse;
}, void, unknown>;
