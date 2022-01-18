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
        ),
        getRequestListener =
            (result: (value: {
                request: http.IncomingMessage;
                response: http.ServerResponse;
            }) => void) => (
                (request: http.IncomingMessage, response: http.ServerResponse) =>
                    result({ request, response })
            ),
        getErrorListener =
            (reject: (reason?: any) => void) => (
                (err: any) => {
                    done = true;
                    reject(err);
                }
            );
    while (!done)
        yield new Promise<{ request: http.IncomingMessage, response: http.ServerResponse }>(
            (result, reject) => {
                server
                    // Prevent registering too many listeners
                    .removeListener('request', getRequestListener(result))
                    .removeListener('error', getErrorListener(reject))
                    // Register event listeners
                    .on('request', getRequestListener(result))
                    .on('error', getErrorListener(reject));
            }
        );
};

