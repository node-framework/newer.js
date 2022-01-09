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
import qs from "query-string";
import fs from "fs";
// Get the body of a request
const getBody = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e7) {
                req.socket.destroy();
                rej();
            }
        });
        req.on('end', () => res(qs.parse(body)));
    });
});
// Get query of an URL
const getQuery = (url) => Object.fromEntries(new URLSearchParams(url.split("?")[1]).entries());
export default class Server {
    /**
     * The constructor
     */
    constructor() {
        this.routes = {};
    }
    /**
     * @param routeName the route name
     * @param route the route handler
     * @returns this server for chaining
     */
    route(routeName, route) {
        this.routes[routeName] = route;
        return this;
    }
    /**
     * @param path the static path
     * @returns this server for chaining
     */
    static(path) {
        this.staticDir = path;
        return this;
    }
    /**
     * @returns a listener that can be use for http.createServer or https.createServer
     */
    callback() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            let hasHandler = false;
            // The context
            const c = {
                request: req,
                response: "",
                query: getQuery(req.url),
                body: yield getBody(req),
                url: req.url,
            };
            // Invoke the route
            if (req.url !== "/favicon.ico") {
                let route = this.routes[req.url];
                if (route.method.toUpperCase() === req.method) {
                    yield route.invoke(c);
                    hasHandler = true;
                }
            }
            // Check whether any route handler has been called
            if (!hasHandler) {
                if (this.staticDir)
                    c.response =
                        fs.readFileSync(this.staticDir + req.url)
                            .toString();
                else
                    res.writeHead(404);
            }
            // End the response
            res.end(c.response);
        });
    }
    /**
     * Start the server
     * @param port the port to listen to
     * @param host the hostname to listen to
     * @param backlog the backlog
     * @returns this server for chaining
     */
    listen(port, host, backlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => {
                this.server = http
                    .createServer(this.callback())
                    .listen(port !== null && port !== void 0 ? port : 8080, host !== null && host !== void 0 ? host : "127.0.0.1", backlog !== null && backlog !== void 0 ? backlog : 0, () => res(this));
            });
        });
    }
    /**
     * Close the server
     * @returns this server for chaining
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                this.server.close(err => err ? rej(err) : res(this));
            });
        });
    }
}
