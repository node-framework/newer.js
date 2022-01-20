import https from "https";
import http from "http";

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
 * Create a simple server
 */
export default async function* simple(opts: SimpleOptions = {}) {
    let done = false;
    let rejectReason: Error;

    const
        // The server 
        server =
            // Check HTTPS mode
            (opts.httpsMode ? https : http)

                // Create the server
                .createServer(opts.options)

                // Start the server
                .listen(
                    opts.port ?? 80,
                    opts.hostname ?? "localhost",
                    opts.backlog ?? 0
                )
                // End the loop if server closed
                .on("close", () => {
                    done = true
                })
                // End the loop and throw error if error occured
                .on("error", err => {
                    rejectReason = err;
                });

    // Handle each requests using yield
    while (!done && !rejectReason)
        // Get requests
        yield new Promise<{
            /**
             * The requests
             */
            request: http.IncomingMessage,
            /**
             * The response
             */
            response: http.ServerResponse
        }>(result => {
            server
                // Register 'request event'
                .once('request',
                    (request, response) => {
                        result({
                            request,
                            response
                        });
                    }
                );
        });
    if (rejectReason)
        return Promise.reject(rejectReason);
};
