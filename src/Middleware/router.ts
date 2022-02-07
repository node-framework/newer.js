import path from "path";
import { Context, Handler, Middleware, NextFunction } from "../declarations";

export default class Router implements Middleware {
    private routes: {
        [name: string]: Handler
    }

    private middlewares: Middleware[];

    /**
     * Create a router
     * @param routeName the route name
     */
    constructor(private routeName: string = "/") {
        this.routes = {};
        this.middlewares = [];
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
    async invoke(ctx: Context, nxt?: NextFunction): Promise<void> {
        // When there is no middlewares
        if (this.middlewares.length === 0) {
            // Get the route
            const target = this.routes[ctx.url];

            // Check whether this route has been registered
            if (target && target[ctx.method])
                // Invoke route
                await target[ctx.method](ctx);
        }

        // Else
        const next = async (index: number, max: number) => {
            // When the last middleware called `next()`
            if (index === max) {
                // Get the route
                const target = this.routes[ctx.url];

                // Check whether this route has been registered
                if (target && target[ctx.method])
                    // Invoke route
                    await target[ctx.method](ctx);
            }

            // Else
            else if (index < max) {
                // When response ended
                if (ctx.responseEnded)
                    // End the function
                    return;

                // When not invoke the middleware
                await this.middlewares[index + 1]?.invoke(ctx, async () => next(index + 1, max));
            }
        }

        // Invoke the middleware
        await this.middlewares[0]?.invoke(ctx, async () => next(0, this.middlewares.length));

        if (nxt)
            // End the function
            await nxt();
    }
}