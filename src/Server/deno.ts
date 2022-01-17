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
export default (opts: SimpleOptions = {}) =>
    (async function* () {
        const server = (opts.httpsMode ? https : http)
            .createServer(opts.options)
            .listen(
                opts.port ?? 80,
                opts.hostname ?? "localhost",
                opts.backlog ?? 0
            );
        while (true)
            yield new Promise<{ request: http.IncomingMessage, response: http.ServerResponse }>(
                (result, reject) => {
                    server
                        .on('request',
                            (request, response) => {
                                server.removeAllListeners();
                                result({ request, response })
                            }
                        )
                        .on('error', err => {
                            server.removeAllListeners();
                            reject(err);
                        })
                }
            );
    })();

