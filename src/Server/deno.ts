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
            );

    // Handle each requests using yield
    while (true) {
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
    }
};

