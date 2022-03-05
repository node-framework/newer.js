"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
/**
 * Create a simple server
 */
function simple(opts = {}) {
    // The server 
    const server = 
    // Check HTTPS mode
    (opts.httpsMode ? https_1.default : http_1.default)
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
exports.default = simple;
;
