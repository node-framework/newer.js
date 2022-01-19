/// <reference types="node" />
import https from "https";
import http from "http";
/**
 * Server options
 */
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
export default function simple(opts?: SimpleOptions): AsyncGenerator<{
    /**
     * The requests
     */
    request: http.IncomingMessage;
    /**
     * The response
     */
    response: http.ServerResponse;
}, void, unknown>;
