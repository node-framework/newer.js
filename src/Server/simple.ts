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
    // Server error 
    let rejectReason: Error;

    // The server 
    const server =
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
            // End the loop and throw error if error occured
            .on("error", err => rejectReason = err);

    // Handle each requests
    while (!rejectReason) 
        // Yield requests
        yield new Promise<{
            /**
             * The requests
             */
            request: http.IncomingMessage,
            /**
             * The response
             */
            response: http.ServerResponse
        }>(result =>
            // Register 'request' event
            server.once('request', (request, response) =>
                result({ request, response })
            )
        );
    
    // Close the server
    server.close();

    // Check whether error occured
    if (rejectReason)
        // Throw error in promise
        return Promise.reject(rejectReason);
};