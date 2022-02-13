import { Context, Handler, Middleware, NextFunction } from "../declarations";
/**
 * Create a server router
 *
 * All the middlewares will be executed first, and then the handler will be executed.
 *
 * Router can be nested using `Router.middleware`
 */
export default class Router implements Middleware {
    private routeName;
    private routes;
    private middlewares;
    /**
     * Create a router
     * @param routeName the route name
     */
    constructor(routeName?: string);
    /**
     * Register a subroute
     * @param routeName the route name (default to "/")
     * @param routeHandler the route handler
     * @returns This router for chaining
     */
    route(routeName: string, routeHandler: Handler): this;
    /**
     * Register a middleware
     * @param md a middleware (or another router)
     * @returns this router for chaining
     */
    middleware(md: Middleware): this;
    /**
     * Invoke the route
     * @param ctx The context
     * @returns no result
     */
    invoke(ctx: Context, next: NextFunction): Promise<void>;
}
