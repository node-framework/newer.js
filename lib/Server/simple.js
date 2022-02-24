import https from "https";
import http from "http";
/**
 * Create a simple server
 */
export default function simple(opts = {}) {
    // The server 
    const server = 
    // Check HTTPS mode
    (opts.httpsMode ? https : http)
        // Create the server
        .createServer(opts.options)
        // Start the server
        .listen(opts.port ?? 80, opts.hostname ?? "localhost", opts.backlog ?? 0);
    return {
        server,
        async *[Symbol.asyncIterator]() {
            try {
                // Handle each requests
                while (true)
                    // Yield requests
                    yield new Promise(result => 
                    // Register 'request' event
                    server.once('request', (_, response) => result(response)));
            }
            catch (e) {
                return e;
            }
            finally {
                // Close the server
                server.close();
            }
        }
    };
}
;
