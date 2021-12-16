// @ts-check
import http from "http";

/**
 * @param {string} url 
 * @param {string} paramsUrl 
 */
const getParams = (url, paramsUrl) => {
    let parts = url.split("/");
    let params = paramsUrl.split("/");
    let extractedParams = [];
    for (let i in params)
        if (params[i].indexOf(":") === 0)
            extractedParams.push({
                name: params[i].substring(1),
                index: i
            });
    let reqParams = {};
    for (let e of extractedParams)
        reqParams[e.name] = parts[e.index];
    return reqParams;
}

export default class NodeServer {
    /**
     * @type {{ [route: string]: (req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void}}
     */
    routes;
    /**
     * @type {((req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void)[]}
     */
    plugins;
    /**
     * @type {import("http").Server}
     */
    #server;
    /**
     * @type {number}
     */
    port;
    /**
     * @type {string}
     */
    hostname;
    /**
     * @type {string}
     */
    staticPath;
    /**
     * @param {{ port?: number, hostname?: string }} param
     */
    constructor({ port = 8080, hostname = "127.0.0.1" } = {}) {
        this.port = port;
        this.hostname = hostname;
        this.routes = {};
        this.plugins = [];
        this.staticPath = ".";
    };
    /**
     * @returns {Promise<NodeServer>}
     */
    start = async () =>
        new Promise((res, rej) => {
            try {
                this.#server = http.createServer(this.callback()).listen(this.port, this.hostname, () => res(this));
            } catch (e) {
                rej(e);
            }
        });
    /**
     * @returns {Promise<NodeServer>}
     */
    stop = async () =>
        new Promise((res, rej) => this.#server.close(err => err ? rej(err) : res(this)));
    /**
     * @param {string} route 
     * @param {(req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void> | void} listener 
     * @description listener should be asynchronous
     */
    register = (route, listener) => (
        this.routes[route] = listener,
        this
    );
    /**
     * @param {...(req: import("http").IncomingMessage, res: import("http").ServerResponse, server: NodeServer) => Promise<void> | void} listener 
     * @description Middlewares
     * @returns {NodeServer} this server
     */
    use = (...listener) => (
        this.plugins.push(...listener),
        this
    );
    /**
     * @param {string} pathname static path
     * @returns {NodeServer} this server
     */
    useStaticPath = pathname => (
        this.staticPath = pathname,
        this
    );
    /**
     * @returns {(req: import("http").IncomingMessage, res: import("http").ServerResponse) => Promise<void>}
     */
    callback = () => (
        /**
         * @param {import("http").IncomingMessage} req 
         * @param {import("http").ServerResponse} res 
         */
        async (req, res) => {
            // Redirect
            // @ts-ignore
            res.redirect = (/** @type {string} */ url) => res.writeHead(302, {
                'Location': url
            });
            // Init plugins
            if (this.plugins.length !== 0)
                for (const plugin of this.plugins)
                    await plugin(req, res, this);
            // Init routes
            if (Object.keys(this.routes).length !== 0)
                for (const route in this.routes)
                    if (req.url === route || route.includes(":")) {
                        if (route.includes(":"))
                            // @ts-ignore
                            req.params = getParams(req.url, route);
                        this.routes[route](req, res);
                    }
            // End
            if (!res.writableEnded)
                res.end();
        }
    );
};

