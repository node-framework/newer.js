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
const fs_1 = __importDefault(require("fs"));
const simple_1 = __importDefault(require("./simple"));
const BodyParser_1 = require("../Utils/BodyParser");
class Server {
    /**
     * The constructor
     */
    constructor(options, httpsMode) {
        this.options = options;
        this.httpsMode = httpsMode;
        this.mds = [];
        this.iconPath = "./favicon.ico";
    }
    /**
     * Set the icon path
     * @param path the icon path
     * @returns this server for chaining
     */
    icon(path) {
        this.iconPath = path;
        return this;
    }
    /**
     * Add middleware
     * @param m middleware
     * @returns this server for chaining
     */
    middleware(...m) {
        // Add middleware
        this.mds.push(...m);
        // Return this server for chaining
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
        var _a, _b;
        // Check whether content and status code is set
        if (!ctx.response && !ctx.statusCode) {
            // Set status code to 404
            ctx.statusCode = 404;
            // Set the response
            ctx.response = "Cannot " + ctx.method + " " + ctx.url;
        }
        // Write status code 
        res.writeHead((_a = ctx.statusCode) !== null && _a !== void 0 ? _a : 200);
        // End the response
        res.end((_b = ctx.response) !== null && _b !== void 0 ? _b : "");
    }
    /**
     * Start the server
     * @param port the port to listen to
     * @param hostname the hostname to listen to
     * @param backlog the backlog
     */
    listen(port = 80, hostname = "localhost", backlog = 0) {
        var e_1, _a;
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // Get requests
            const requests = (0, simple_1.default)({
                port,
                hostname,
                backlog,
                options: this.options,
                httpsMode: this.httpsMode
            });
            // Http
            this.rawServer = requests.server;
            try {
                // Loop through the requests
                for (var requests_1 = __asyncValues(requests), requests_1_1; requests_1_1 = yield requests_1.next(), !requests_1_1.done;) {
                    const res = requests_1_1.value;
                    const 
                    // The request
                    { req } = res, 
                    // The context
                    c = {
                        // Raw request
                        rawRequest: {
                            req, res
                        },
                        // End the response manually
                        responseEnded: false,
                        // Default status code
                        statusCode: req.statusCode,
                        // The response, default to empty
                        response: "",
                        // The query of the URL
                        query: (0, BodyParser_1.getQuery)(req.url),
                        // The body of the request
                        body: yield (0, BodyParser_1.getBody)(req),
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
                        remoteAddress: req.socket.remoteAddress,
                        // Subhost
                        subhost: req.headers.host.slice(0, req.headers.host.lastIndexOf(hostname) - 1)
                    };
                    // Check whether the request is a favicon
                    if (req.url === "/favicon.ico")
                        c.response = (_b = this.readFile(this.iconPath)) !== null && _b !== void 0 ? _b : "";
                    // Next function
                    const next = (index, max) => __awaiter(this, void 0, void 0, function* () {
                        var _d;
                        if (index < max) {
                            // When response ended
                            if (c.responseEnded)
                                // End the function
                                return;
                            // Invoke the middleware
                            yield ((_d = this.mds[index + 1]) === null || _d === void 0 ? void 0 : _d.invoke(c, () => __awaiter(this, void 0, void 0, function* () { return next(index + 1, max); })));
                        }
                    });
                    // Invoke the middleware
                    yield ((_c = this.mds[0]) === null || _c === void 0 ? void 0 : _c.invoke(c, () => __awaiter(this, void 0, void 0, function* () { return next(0, this.mds.length); })));
                    // End the response
                    this.endResponse(c, res);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (requests_1_1 && !requests_1_1.done && (_a = requests_1.return)) yield _a.call(requests_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    /**
     * Get the HTTP or HTTPS server
     */
    get http() {
        return this.rawServer;
    }
}
exports.default = Server;
