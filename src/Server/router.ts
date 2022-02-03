import path from "path";
import { Context, Handler, Middleware } from "./declarations";

export default class Router implements Middleware {
    private routes: {
        [name: string]: Handler
    }

    private middlewares: Middleware[];

    private routeName: string;

    /**
     * Create a router
     * @param routeName the route name
     */
    constructor(routeName: string = "/") {
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
    route(routeName: string, routeHandler: Handler) {
        this.routes[
            path
                .join(this.routeName, routeName)
                // @ts-ignore
                .replaceAll("\\", "/")
        ] = routeHandler;
        return this;
    }

    /**
     * Register a middleware
     * @param md a middleware (or another router)
     * @returns this router for chaining
     */
    middleware(md: Middleware) {
        if (md instanceof Router)
            md.routeName = path
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
    async invoke(ctx: Context): Promise<void> {
        // Loop through middlewares
        for (const md of this.middlewares) {
            // Invoke the middleware
            await md.invoke(ctx);

            // Check whether response ended manually
            if (ctx.responseEnded)
                return;
        }

        // Get the route
        const target = this.routes[ctx.url];

        // Check whether this route has been registered
        if (target && target[ctx.method])
            // Invoke route
            await target[ctx.method](ctx);
    }
}