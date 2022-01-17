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
export default class Simple {
    private server;
    private done;
    /**
     * Create and start a server
     *
     * @param opts server options
     */
    constructor(opts?: SimpleOptions);
    /**
     * Get requests in asynchronous iterator
     *
     * @returns requests in asynchronous iterator
     */
    get requests(): {
        [Symbol.asyncIterator](): {
            next(): Promise<{
                done: boolean;
                value: {
                    request: http.IncomingMessage;
                    response: http.ServerResponse;
                };
            }>;
        };
    };
    /**
     * Close the server
     *
     * @returns this object
     */
    close(): this;
}
