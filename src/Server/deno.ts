import https from "https";
import http from "http";

declare global {
    interface AsyncGenerator {
        /**
         * Close the server
         */
        close(): void;
    }
}

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

class Simple {
    private server: http.Server | https.Server;
    private done: boolean;
    private opts: SimpleOptions;

    /**
     * Create and start a server
     * 
     * @param opts server options
     */
    constructor(opts: SimpleOptions = {}) {
        this.server = (opts.httpsMode ? https : http)
            .createServer(opts.options);
    }

    /**
     * Start the server
     */
    async ready() {
        this.server.listen(this.opts.port ?? 80, this.opts.hostname ?? "localhost", this.opts.backlog ?? 0);
        this.done = false;
    }

    /**
     * Get requests in asynchronous iterator
     * 
     * @returns requests in asynchronous iterator
     */
    get requests(): AsyncGenerator<{
        request: http.IncomingMessage;
        response: http.ServerResponse;
    }, void, unknown> {
        let p = this;
        return {
            ...(async function* () {
                while (!p.done)
                    yield new Promise<{ request: http.IncomingMessage, response: http.ServerResponse }>(
                        (result, reject) => {
                            p.server.on('request', (request, response) =>
                                result({ request, response })
                            );

                            p.server.on('error', reject);
                        }
                    )
            })(),
            close: () => {
                this.server.close();
                this.done = true;
            }
        };
    }
}

/**
 * Create a simple server
 */
export default async (opts?: SimpleOptions) => {
    const server = new Simple(opts);
    await server.ready();
    return server.requests;
}
