var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from "http";
export default class NodeServer {
    /**
     * @param options server options
     */
    constructor(options = {}) {
        var _a, _b;
        /**
         * @param fn an error handler
         */
        this.onError = (fn) => (this.errHandler = fn,
            this);
        /**
         * @returns The server after starting
         */
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                try {
                    this.server =
                        http.createServer(this.callback()).listen(this.port, this.hostname, () => res(this));
                }
                catch (e) {
                    rej(e);
                }
            });
        });
        /**
         * @returns The server after being stopped
         */
        this.stop = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => this.server.close(err => err ? rej(err) : res(this)));
        });
        /**
         * @param route the route name
         * @param listener the route listener
         * @returns this server
         */
        this.register = (route, listener) => (this.routes[route] = listener,
            this);
        /**
         * @description Middlewares
         * @returns {NodeServer} this server
         */
        this.use = (...listener) => (this.plugins.push(...listener),
            this);
        /**
         * @returns the callback of this server
         */
        this.callback = () => ((req, res) => __awaiter(this, void 0, void 0, function* () {
            // Check whether the target route has any handler
            let hasHandler = false;
            // Error handler 
            const raise = (err) => err ? this.errHandler(err) : void 0;
            // Init plugins
            for (const plugin of this.plugins)
                // Run plugins with an error raiser
                yield plugin(req, res, raise);
            // Init route
            const route = this.routes[req.url];
            // Run route handler
            if (route) {
                yield route(req, res, raise);
                // has handler to true
                hasHandler = true;
            }
            // End the response
            if (!res.writableEnded || !res.writableFinished) {
                // Check whether the route has been handled
                if (!hasHandler)
                    res.statusCode = 404;
                res.end();
            }
        }));
        this.port = (_a = options.port) !== null && _a !== void 0 ? _a : 8080;
        this.hostname = (_b = options.hostname) !== null && _b !== void 0 ? _b : "127.0.0.1";
        this.routes = {};
        this.plugins = [];
    }
    ;
}
;
