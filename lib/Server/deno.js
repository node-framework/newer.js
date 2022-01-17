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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
class Simple {
    /**
     * Create and start a server
     *
     * @param opts server options
     */
    constructor(opts = {}) {
        this.server = (opts.httpsMode ? https_1.default : http_1.default)
            .createServer(opts.options);
    }
    /**
     * Start the server
     */
    ready() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.server.listen((_a = this.opts.port) !== null && _a !== void 0 ? _a : 80, (_b = this.opts.hostname) !== null && _b !== void 0 ? _b : "localhost", (_c = this.opts.backlog) !== null && _c !== void 0 ? _c : 0);
            this.done = false;
        });
    }
    /**
     * Get requests in asynchronous iterator
     *
     * @returns requests in asynchronous iterator
     */
    get requests() {
        let p = this;
        return Object.assign(Object.assign({}, (function () {
            return __asyncGenerator(this, arguments, function* () {
                while (!p.done)
                    yield yield __await(new Promise((result, reject) => {
                        p.server.on('request', (request, response) => result({ request, response }));
                        p.server.on('error', reject);
                    }));
            });
        })()), { close: () => {
                this.server.close();
                this.done = true;
            } });
    }
}
/**
 * Create a simple server
 */
exports.default = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    const server = new Simple(opts);
    yield server.ready();
    return server.requests;
});
