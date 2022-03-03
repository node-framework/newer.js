"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
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
    var _a, _b, _c;
    // The server 
    const server = 
    // Check HTTPS mode
    (opts.httpsMode ? https_1.default : http_1.default)
        // Create the server
        .createServer(opts.options)
        // Start the server
        .listen((_a = opts.port) !== null && _a !== void 0 ? _a : 80, (_b = opts.hostname) !== null && _b !== void 0 ? _b : "localhost", (_c = opts.backlog) !== null && _c !== void 0 ? _c : 0);
    return {
        server,
        [Symbol.asyncIterator]() {
            return __asyncGenerator(this, arguments, function* _a() {
                try {
                    // Handle each requests
                    while (true)
                        // Yield requests
                        yield yield __await(new Promise(result => 
                        // Register 'request' event
                        server.once('request', (_, response) => result(response))));
                }
                catch (e) {
                    return yield __await(e);
                }
                finally {
                    // Close the server
                    server.close();
                }
            });
        }
    };
}
exports.default = simple;
;
