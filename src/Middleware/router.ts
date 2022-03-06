import path from "path";
import { Context, Handler, Middleware, NextFunction } from "../declarations";

/**
 * Create a server router
 * 
 * All the middlewares will be executed first, and then the handler will be executed.
 * 
 * Router can be nested using `Router.middleware`
 */
export default class Router implements Middleware {
    private middlewares: Middleware[];

    /**
     * Create a router
     * @param routeName the route name
     */
    constructor(private routeName: string = "/") {
        this.middlewares = [];
    }

    /**
     * Register a subroute
     * @param routeName the route name (default to "/")
     * @param routeHandler the route handler
     * @returns This router for chaining
     */
    route(routeName: string, routeHandler: Handler) {
        this.middleware({
            // When the middleware is invoked
            invoke: async (ctx, next) => {
                if (
                    ctx.url === (
                        path
                            .join(this.routeName, routeName)
                            .replaceAll("\\", "/")

                        // Check whether the route is not null
                    ) && routeHandler

                    // Check whether the route contains a handler for current method
                    && routeHandler[ctx.method]
                )
                    // Invoke the route handler
                    await routeHandler[ctx.method](ctx);

                // Next middleware
                await next();
            }
        });
        return this;
    }

    /**
     * Register a middleware
     * @param m a middleware (or another router)
     * @returns this router for chaining
     */
    middleware(...m: Middleware[]) {
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
    async invoke(ctx: Context, next: NextFunction): Promise<void> {
        // Execute the middlewares
        const __next = async (index: number, max: number) => {
            // Else
            if (index < max) {
                // When response ended
                if (ctx.responseEnded)
                    // End the function
                    return;

                // When not invoke the middleware
                await this.middlewares[index + 1]?.invoke(ctx, async () => __next(index + 1, max));
            }
        }

        if (ctx.url.startsWith(this.routeName))
            // Invoke the middleware
            await this.middlewares[0]?.invoke(ctx, async () => __next(0, this.middlewares.length));

        // End the function
        await next();
    }
}