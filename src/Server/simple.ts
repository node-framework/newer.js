import https from "https";
import http from "http";
import { SimpleOptions } from "./declarations";

/**
 * Create a simple server
 */
export default function simple(opts: SimpleOptions = {}): { 
    /**
     * The simple HTTP or HTTPS server
     */
    readonly server: http.Server | https.Server; 
    /**
     * The generator
     */
    [Symbol.asyncIterator](): AsyncGenerator<http.ServerResponse, any, unknown>; 
} {
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

    return {
        server,
        async *[Symbol.asyncIterator]() {
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
        }
    }
};
