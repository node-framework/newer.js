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
const path_1 = __importDefault(require("path"));
class Router {
    /**
     * Create a router
     * @param routeName the route name
     */
    constructor(routeName = "/") {
        this.routes = {};
        this.middlewares = [];
        this.routeName = routeName;
    }
    /**
     * Register a subroute
     * @param routeName the route name (default to "/")
     * @param routeHandler the route handler
     * @returns This router for chaining
     */
    route(routeName, routeHandler) {
        this.routes[path_1.default
            .join(this.routeName, routeName)
            // @ts-ignore
            .replaceAll("\\", "/")] = routeHandler;
        return this;
    }
    /**
     * Register a middleware
     * @param md a middleware (or another router)
     * @returns this router for chaining
     */
    middleware(md) {
        if (md instanceof Router)
            md.routeName = path_1.default
                .join(this.routeName, md.routeName)
                // @ts-ignore
                .replaceAll("\\", "/");
        this.middlewares.push(md);
        return this;
    }
    /**
     * Invoke the route
     * @param ctx The context
     * @returns no result
     */
    invoke(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            // Loop through middlewares
            for (const md of this.middlewares) {
                // Invoke the middleware
                yield md.invoke(ctx);
                // Check whether response ended manually
                if (ctx.responseEnded)
                    return;
            }
            // Get the route
            const target = this.routes[ctx.url];
            // Check whether this route has been registered
            if (target && target[ctx.method])
                // Invoke route
                yield target[ctx.method](ctx);
        });
    }
}
exports.default = Router;
