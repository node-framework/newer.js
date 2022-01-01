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
            const raise = (err) => {
                this.err = err;
            };
            // Redirect
            // @ts-ignore
            res.redirect = (url) => res.writeHead(307, {
                'Location': url
            });
            // Write page
            // @ts-ignore
            res.writePage = (url) => res.writeHead(200, {
                'Location': url
            });
            // Init plugins
            if (this.plugins.length !== 0) {
                for (const plugin of this.plugins) {
                    if (this.err)
                        this.errHandler(this.err);
                    // Run plugins with an error raiser
                    await plugin(req, res, raise);
                }
            }
            // Init route
            if (Object.keys(this.routes).length !== 0) {
                const route = this.routes[req.url];
                // Handle errors
                if (this.err)
                    this.errHandler(this.err);
                // run route handler
                if (route) {
                    await route(req, res, raise);
                    // has handler to true
                    hasHandler = true;
                }
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
