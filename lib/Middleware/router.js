import path from "path";
/**
 * Create a server router
 *
 * All the middlewares will be executed first, and then the handler will be executed.
 *
 * Router can be nested using `Router.middleware`
 */
export default class Router {
    routeName;
    routes;
    middlewares;
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
        this.routes[path
            .join(this.routeName, routeName)
            // @ts-ignore
            .replaceAll("\\", "/")] = routeHandler;
        return this;
    }
    /**
     * Register a middleware
     * @param m a middleware (or another router)
     * @returns this router for chaining
     */
    middleware(...m) {
        for (const md of m) {
            // Check whether this middleware is a router
            if (md instanceof Router)
                md.routeName = path
                    .join(this.routeName, md.routeName)
                    // @ts-ignore
                    .replaceAll("\\", "/");
            // Push the middleware
            this.middlewares.push(md);
        }
        // Return this router for chaining
        return this;
    }
    /**
     * Invoke the route
     * @param ctx The context
     * @returns no result
     */
    async invoke(ctx, next) {
        // Execute the middlewares
        const __next = async (index, max) => {
            // Else
            if (index < max) {
                // When response ended
                if (ctx.responseEnded)
                    // End the function
                    return;
                // When not invoke the middleware
                await this.middlewares[index + 1]?.invoke(ctx, async () => __next(index + 1, max));
            }
        };
        if (ctx.url.startsWith(this.routeName)) {
            // Invoke the middleware
            await this.middlewares[0]?.invoke(ctx, async () => __next(0, this.middlewares.length));
            // Get the route
            const target = this.routes[ctx.url];
            // Check whether this route has been registered
            if (target && target[ctx.method])
                // Invoke route
                await target[ctx.method](ctx);
        }
        // End the function
        await next();
    }
}
