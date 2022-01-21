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

    try {
        // Handle each requests
        while (true)
            // Yield requests
            yield new Promise<http.ServerResponse>(result =>
                // Register 'request' event
                server.once('request', (_, response) => result(response))
            );
    } catch (e) {
        return e;
    } finally {
        // Close the server
        server.close();
    } 
};
