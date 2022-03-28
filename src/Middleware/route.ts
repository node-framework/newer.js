import { Context, Handler, Middleware, NextFunction } from "../declarations";

/**
 * Directly add a route 
 * @param routeName The route name
 * @param routeHandler The route handler
 * @returns A middleware
 */
export default function route(routeName: string, routeHandler: Handler): Middleware {
    return {
        async invoke(ctx: Context, next: NextFunction) {
            // When the middleware is invoked
            if (ctx.url === routeName && routeHandler[ctx.method])
                routeHandler[ctx.method](ctx);

            // Call next middleware
            await next();
        }
    };
}