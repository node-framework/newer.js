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
export default async function* (opts: SimpleOptions = {}) {
    // Check whether the server has stopped
    let done = false;

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

        // Detect listeners count
        .setMaxListeners(1);

    // Handle each requests using yield
    while (!done)
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
        }>((result, reject) => 
            server
                // Remove all previous listener
                .removeAllListeners('request')
                .removeAllListeners('error')

                // Register 'request event'
                .on('request',
                    (request, response) =>
                        result({ request, response })
                )

                // Register 'error' event
                .on('error', err => {
                    done = true;
                    reject(err);
                })
        );
};

