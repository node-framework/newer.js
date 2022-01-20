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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(require("query-string"));
const fs_1 = __importDefault(require("fs"));
const simple_1 = __importDefault(require("./simple"));
// Get the body of a request
const getBody = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e7) {
                req.socket.destroy();
                rej("Request data to long");
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
    constructor(options, httpsMode) {
        this.options = options;
        this.httpsMode = httpsMode;
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
    // End the response
    endResponse(ctx, res) {
        var _a;
        // Check whether content and status code is set
        if (!ctx.response && !ctx.statusCode)
            // Set status code to 404 or 204
            ctx.statusCode = ctx.response === null ? 404 : 204;
        // Write status code 
        res.writeHead((_a = ctx.statusCode) !== null && _a !== void 0 ? _a : 200);
        // End the response
        res.end(ctx.response);
    }
    /**
     * Start the server
     * @param port the port to listen to
     * @param hostname the hostname to listen to
     * @param backlog the backlog
     */
    listen(port, hostname, backlog) {
        var e_1, _a;
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _c = __asyncValues((0, simple_1.default)({
                    port,
                    hostname,
                    backlog,
                    options: this.options,
                    httpsMode: this.httpsMode
                })), _d; _d = yield _c.next(), !_d.done;) {
                    const { request: req, response: res } = _d.value;
                    // The context
                    const c = {
                        // End the response manually
                        responseEnded: false,
                        // Default status code
                        statusCode: req.statusCode,
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
                        httpVersion: req.httpVersion,
                        // Server IPv4 address
                        remoteAddress: req.socket.remoteAddress
                    };
                    // Invoke middlewares
                    for (let md of this.mds) {
                        // Invoke the middleware with current context
                        yield md.invoke(c);
                        // Check whether response ended
                        if (c.responseEnded) {
                            // End the response
                            this.endResponse(c, res);
                            // End the function
                            continue;
                        }
                    }
                    // Favicon
                    if (req.url === "/favicon.ico") {
                        // Get parent directory
                        let path = ((_b = this.staticDir) !== null && _b !== void 0 ? _b : ".") + req.url;
                        // Create favicon if it does not exists
                        if (!fs_1.default.existsSync(path))
                            fs_1.default.appendFileSync(path, "");
                    }
                    // Get the route
                    const target = this.routes[req.url];
                    // Check whether this route has been registered
                    if (target && target[req.method])
                        // Invoke route
                        yield target[req.method](c);
                    // Check whether response ended
                    if (c.responseEnded) {
                        this.endResponse(c, res);
                        continue;
                    }
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
                    // End the response
                    this.endResponse(c, res);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
}
exports.default = Server;
