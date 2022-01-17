import https from "https";
import http from "http";

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

export default class Simple {
    private server: http.Server | https.Server;
    private done: boolean;

    /**
     * Create and start a server
     * 
     * @param opts server options
     */
    constructor(opts: SimpleOptions = {}) {
        this.server = (opts.httpsMode ? https : http)
            .createServer(opts.options)
            .listen(opts.port ?? 80, opts.hostname ?? "localhost", opts.backlog ?? 0);
        this.done = false;
    }

    /**
     * Get requests in asynchronous iterator
     * 
     * @returns requests in asynchronous iterator
     */
    get requests() {
        let pointer = this;
        return {
            [Symbol.asyncIterator]() {
                return {
                    async next() {
                        return {
                            done: pointer.done,
                            value: await new Promise<{ request: http.IncomingMessage, response: http.ServerResponse }>(
                                (result, reject) => {
                                    pointer.server.on('request', (request, response) =>
                                        result({ request, response })
                                    );

                                    pointer.server.on('error', reject);
                                }
                            )
                        };
                    }
                }
            }
        }
    }

    /**
     * Close the server
     * 
     * @returns this object
     */
    close() {
        this.server.close();
        this.done = true;
        return this;
    }
}
