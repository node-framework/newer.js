/// <reference types="node" />
import https from "https";
import http from "http";
export default class SimpleServer {
    private server;
    private done;
    /**
     * @param options server options
     * @param httpsMode toggle HTTPS mode
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean);
    /**
     * Start the server
     *
     * @param port Server port
     * @param hostname Server hostname
     * @param backlog Server backlog
     * @returns this object
     */
    listen(port?: number, hostname?: string, backlog?: number): this;
    /**
     * Get requests in asynchronous iterator
     * @returns requests in asynchronous iterator
     */
    requests(): {
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
