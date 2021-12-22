var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NodeServer_server;
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
    constructor({ port = 8080, hostname = "127.0.0.1" } = {}) {
        _NodeServer_server.set(this, void 0);
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                try {
                    __classPrivateFieldSet(this, _NodeServer_server, http.createServer(this.callback()).listen(this.port, this.hostname, () => res(this)), "f");
                }
                catch (e) {
                    rej(e);
                }
            });
        });
        this.stop = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => __classPrivateFieldGet(this, _NodeServer_server, "f").close(err => err ? rej(err) : res(this)));
        });
        this.register = (route, listener) => (this.routes[route] = listener,
            this);
        /**
         * @description Middlewares
         * @returns {NodeServer} this server
         */
        this.use = (...listener) => (this.plugins.push(...listener),
            this);
        /**
         * @returns {NodeServer} this server
         */
        this.useStaticPath = (pathname) => (this.staticPath = pathname,
            this);
        this.callback = () => ((req, res) => __awaiter(this, void 0, void 0, function* () {
            // Redirect
            // @ts-ignore
            res.redirect = (url) => res.writeHead(302, {
                'Location': url
            });
            // Init plugins
            if (this.plugins.length !== 0)
                for (const plugin of this.plugins)
                    yield plugin(req, res, this);
            // Init routes
            if (Object.keys(this.routes).length !== 0)
                for (const route in this.routes) {
                    const reqParams = getParams(req.url, route);
                    if ((req.url === route)
                        !==
                            (Object.keys(reqParams).length !== 0)) {
                        // @ts-ignore
                        req.params = reqParams !== null && reqParams !== void 0 ? reqParams : null;
                        this.routes[route](req, res);
                    }
                }
            // End
            if (!res.writableEnded || !res.writableFinished)
                res.end();
        }));
        this.port = port;
        this.hostname = hostname;
        this.routes = {};
        this.plugins = [];
        this.staticPath = ".";
    }
    ;
}
_NodeServer_server = new WeakMap();
;
