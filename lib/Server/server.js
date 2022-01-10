"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const query_string_1 = __importDefault(require("query-string"));
const fs_1 = __importDefault(require("fs"));
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
        req.on('end', () => res(query_string_1.default.parse(body)));
    });
});
// Get query of an URL
const getQuery = (url) => Object.fromEntries(new URLSearchParams(url.split("?")[1]).entries());
class Server {
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
            var _a, _b;
            let statusCode;
            // Read file if file not found return null
            const readFile = (path) => {
                try {
                    return fs_1.default.readFileSync(path).toString();
                }
                catch (e) {
                    return null;
                }
            };
            // Check whether this route has handler
            let hasHandler = false;
            // The context
            const c = {
                statusCode: 200,
                request: req,
                response: "",
                query: getQuery(req.url),
                body: yield getBody(req),
                url: req.url,
            };
            // Favicon
            if (req.url === "/favicon.ico") {
                let dir = (_a = this.staticDir) !== null && _a !== void 0 ? _a : ".";
                if (!fs_1.default.existsSync(dir + req.url))
                    fs_1.default.appendFileSync(dir + req.url, "");
            }
            // Invoke the route
            if (req.url !== "/favicon.ico") {
                let route = this.routes[req.url];
                if (((_b = route === null || route === void 0 ? void 0 : route.method) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === req.method) {
                    yield route.invoke(c);
                    hasHandler = true;
                    statusCode = c.statusCode;
                }
            }
            // Check whether any route handler has been called
            if (!hasHandler) {
                if (this.staticDir) {
                    let content = readFile(this.staticDir + req.url);
                    if (!content && !statusCode)
                        statusCode = content === null ? 404 : 204;
                    else
                        c.response = content;
                }
                else if (!statusCode)
                    statusCode = 404;
            }
            // Write status code
            res.writeHead(statusCode);
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
                this.server = http_1.default
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
exports.default = Server;
