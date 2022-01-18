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

/**
 * Create a simple server
 */
export default async function* (opts: SimpleOptions = {}) {
    let done = false;
    const server = (opts.httpsMode ? https : http)
        .createServer(opts.options)
        .listen(
            opts.port ?? 80,
            opts.hostname ?? "localhost",
            opts.backlog ?? 0
        )
        .setMaxListeners(1);
    while (!done)
        yield new Promise<{ request: http.IncomingMessage, response: http.ServerResponse }>(
            (result, reject) => {
                server
                    // Prevent adding so many listener
                    .removeAllListeners('request')
                    .removeAllListeners('error')
                    // Register event listeners
                    .on('request',
                        (request: http.IncomingMessage, response: http.ServerResponse) =>
                            result({ request, response })
                    )
                    .on('error', (err: any) => {
                        done = true;
                        reject(err);
                    });
            }
        );
};

