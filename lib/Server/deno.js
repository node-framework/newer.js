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
class SimpleServer {
    /**
     * @param options server options
     * @param httpsMode toggle HTTPS mode
     */
    constructor(options, httpsMode) {
        this.server = (httpsMode ? https_1.default : http_1.default).createServer(options);
    }
    /**
     * Start the server
     *
     * @param port Server port
     * @param hostname Server hostname
     * @param backlog Server backlog
     * @returns this object
     */
    listen(port, hostname, backlog) {
        this.server.listen(port, hostname, backlog);
        this.done = false;
        return this;
    }
    /**
     * Get requests in asynchronous iterator
     * @returns requests in asynchronous iterator
     */
    requests() {
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
exports.default = (init) => {
    const { options, httpsMode, port, hostname, backlog } = init;
    const server = new SimpleServer(options, httpsMode);
    server.listen(port, hostname, backlog);
    return {
        requests: server.requests(),
        close: () => server.close(),
    };
};
