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
            .createServer(opts.options)
            .listen(opts.port, opts.hostname, opts.backlog);
        this.done = false;
    }
    /**
     * Get requests in asynchronous iterator
     *
     * @returns requests in asynchronous iterator
     */
    get requests() {
        let pointer = this;
        return {
            [Symbol.asyncIterator]() {
                return {
                    next() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                done: pointer.done,
                                value: yield new Promise((result, reject) => {
                                    pointer.server.on('request', (request, response) => result({ request, response }));
                                    pointer.server.on('error', reject);
                                })
                            };
                        });
                    }
                };
            }
        };
    }
    /**
     * Close the server
     *
     * @returns this object
     */
    close() {
        this.server.close();
        this.done = true;
        return this;
    }
}
exports.default = Simple;
