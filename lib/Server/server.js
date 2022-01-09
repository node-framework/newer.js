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
const getBody = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Body
    // @ts-ignore
    return req.body = yield new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e6) {
                req.socket.destroy();
                rej();
            }
        });
        req.on('end', () => res(qs.parse(body)));
    });
});
const getQuery = (url) => Object.fromEntries(new URLSearchParams(url.split("?")[1]).entries());
export default class Server {
    constructor() {
        this.routes = {};
    }
    route(routeName, route) {
        this.routes[routeName] = route;
        return this;
    }
    callback() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            // The context
            const c = {
                request: req,
                response: "",
                query: getQuery(req.url),
                body: yield getBody(req),
                url: req.url,
            };
            // Invoke the route
            yield this.routes[req.url].invoke(c);
            // End the response
            res.end(c);
        });
    }
    listen(port, host, backlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => {
                this.server = http
                    .createServer(this.callback())
                    .listen(port, host, backlog, res);
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                this.server.close(err => {
                    if (err)
                        rej(err);
                    res();
                });
            });
        });
    }
}
