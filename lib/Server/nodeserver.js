import http from "http";
const getParams = (url, paramsUrl) => {
    let parts = url.split("/");
    let params = paramsUrl.split("/");
    if (params.length !== parts.length)
        return {};
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
};
export default class NodeServer {
    routes;
    plugins;
    #server;
    port;
    hostname;
    staticPath;
    constructor({ port = 8080, hostname = "127.0.0.1" } = {}) {
        this.port = port;
        this.hostname = hostname;
        this.routes = {};
        this.plugins = [];
        this.staticPath = ".";
    }
    ;
    start = async () => new Promise((res, rej) => {
        try {
            this.#server = http.createServer(this.callback()).listen(this.port, this.hostname, () => res(this));
        }
        catch (e) {
            rej(e);
        }
    });
    stop = async () => new Promise((res, rej) => this.#server.close(err => err ? rej(err) : res(this)));
    register = (route, listener) => (this.routes[route] = listener,
        this);
    use = (...listener) => (this.plugins.push(...listener),
        this);
    useStaticPath = (pathname) => (this.staticPath = pathname,
        this);
    callback = () => (async (req, res) => {
        res.redirect = (url) => res.writeHead(302, {
            'Location': url
        });
        if (this.plugins.length !== 0)
            for (const plugin of this.plugins)
                await plugin(req, res, this);
        if (Object.keys(this.routes).length !== 0)
            for (const route in this.routes) {
                const reqParams = getParams(req.url, route);
                if ((req.url === route)
                    !==
                        (Object.keys(reqParams).length !== 0)) {
                    req.params = reqParams ?? null;
                    this.routes[route](req, res);
                }
            }
        if (!res.writableEnded || !res.writableFinished)
            res.end();
    });
}
;
