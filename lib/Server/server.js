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
        this.mds = [];
    }
    /**
     * Register a route
     * @param routeName the route name
     * @param route the route handler
     * @returns this server for chaining
     */
    route(routeName, route) {
        this.routes[routeName] = route;
        return this;
    }
    /**
     * Add middleware
     * @param m middleware
     * @returns this server for chaining
     */
    middleware(m) {
        this.mds.push(m);
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
    // Read file if file not found return null
    readFile(path) {
        try {
            return fs_1.default.readFileSync(path).toString();
        }
        catch (e) {
            return null;
        }
    }
    /**
     * @returns a listener that can be use for http.createServer or https.createServer
     */
    callback() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // The context
            const c = {
                // Default status code
                statusCode: undefined,
                // The response, default to empty
                response: "",
                // The query of the URL
                query: getQuery(req.url),
                // The body of the request
                body: yield getBody(req),
                // The request url
                url: req.url,
                // Append file content
                writeFile: path => {
                    var _a;
                    // Append file content to response
                    c.response += (_a = this.readFile(path)) !== null && _a !== void 0 ? _a : "";
                },
                // Header get and set
                header: (name, value) => 
                // Get or set a header
                value
                    ? void res.setHeader(name, value)
                    : res.getHeader(name),
                // Set multiple headers or get request headers
                headers: headers => {
                    if (!headers)
                        return req.headers;
                    for (let name in headers)
                        res.setHeader(name, headers[name]);
                },
                // Socket
                socket: res.socket,
                // Method
                method: req.method,
                // HTTP version
                httpVersion: req.httpVersion
            };
            // Invoke middlewares
            for (let md of this.mds)
                md.invoke(c);
            // Favicon
            if (req.url === "/favicon.ico") {
                // Get parent directory
                let dir = (_a = this.staticDir) !== null && _a !== void 0 ? _a : ".";
                // Create favicon if it does not exists
                if (!fs_1.default.existsSync(dir + req.url))
                    fs_1.default.appendFileSync(dir + req.url, "");
            }
            // Get the route
            let target = this.routes[req.url];
            // Check whether this route has been registered
            if (target && target[req.method])
                // Invoke route
                yield target[req.method](c);
            // Check whether response is not empty
            if (!c.response) {
                // Check whether the static dir is set
                if (this.staticDir) {
                    // Set the response to the read data
                    c.response = this.readFile(this.staticDir + req.url);
                }
                // If status code in not set and static dir is not set
                else if (!c.statusCode) 
                    // Set status code to 404
                    c.statusCode = 404;
            }
            // Check whether content and status code is set
            if (!c.response && !c.statusCode)
                // Set status code to 404 or 204
                c.statusCode = c.response === null ? 404 : 204;
            // Write status code if status code not equals 307
            res.writeHead((_b = c.statusCode) !== null && _b !== void 0 ? _b : 200);
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
