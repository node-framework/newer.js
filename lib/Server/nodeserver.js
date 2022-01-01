import http from "http";
export default class NodeServer {
    /**
     * @param options server options
     */
    constructor(options = {}) {
        /**
         * @param fn an error handler
         */
        this.onError = (fn) => (this.errHandler = fn,
            this);
        /**
         * @returns The server after starting
         */
        this.start = async () => new Promise((res, rej) => {
            try {
                this.server =
                    http.createServer(this.callback()).listen(this.port, this.hostname, () => res(this));
            }
            catch (e) {
                rej(e);
            }
        });
        /**
         * @returns The server after being stopped
         */
        this.stop = async () => new Promise((res, rej) => this.server.close(err => err ? rej(err) : res(this)));
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
        this.callback = () => (async (req, res) => {
            // Check whether the target route has any handler
            let hasHandler = false;
            // Error handler 
            const raise = (err) => err ? this.errHandler(err) : void 0;
            // Init plugins
            for (const plugin of this.plugins)
                // Run plugins with an error raiser
                await plugin(req, res, raise);
            // Init route
            const route = this.routes[req.url];
            // Run route handler
            if (route) {
                await route(req, res, raise);
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
        });
        this.port = options.port ?? 8080;
        this.hostname = options.hostname ?? "127.0.0.1";
        this.routes = {};
        this.plugins = [];
    }
    ;
}
;
