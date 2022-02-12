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
        this.routeName = routeName;
        this.routes = {};
        this.middlewares = [];
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
    invoke(ctx, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // When there is no middlewares
            if (this.middlewares.length === 0) {
                // Get the route
                const target = this.routes[ctx.url];
                // Check whether this route has been registered
                if (target && target[ctx.method])
                    // Invoke route
                    yield target[ctx.method](ctx);
            }
            // Else
            const __next = (index, max) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                // When the last middleware called `next()`
                if (index === max) {
                    // Get the route
                    const target = this.routes[ctx.url];
                    // Check whether this route has been registered
                    if (target && target[ctx.method])
                        // Invoke route
                        yield target[ctx.method](ctx);
                }
                // Else
                else if (index < max) {
                    // When response ended
                    if (ctx.responseEnded)
                        // End the function
                        return;
                    // When not invoke the middleware
                    yield ((_b = this.middlewares[index + 1]) === null || _b === void 0 ? void 0 : _b.invoke(ctx, () => __awaiter(this, void 0, void 0, function* () { return __next(index + 1, max); })));
                }
            });
            // Invoke the middleware
            yield ((_a = this.middlewares[0]) === null || _a === void 0 ? void 0 : _a.invoke(ctx, () => __awaiter(this, void 0, void 0, function* () { return __next(0, this.middlewares.length); })));
            // End the function
            yield next();
        });
    }
}
exports.default = Router;
