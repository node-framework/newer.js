import { serialize, parse } from "../Utils/cookie.js";
import { Context, Middleware, NextFunction, CookieOptions } from "../declarations.js";

declare module '../declarations' {
    interface Context {
        cookies?: {
            [key: string]: any;
        };
    }
}

/**
 * Cookie middleware
 */
export default class Cookies implements Middleware {
    readonly options: CookieOptions;

    /**
     * @param options Cookie options
     */
    constructor(options: CookieOptions) {
        this.options = options;
    }

    /**
     * @param ctx 
     * @param next 
     */
    async invoke(ctx: Context, next: NextFunction): Promise<void> {
        // Set cookies 
        Object.defineProperty(ctx, "cookies", {
            // Get cookies
            get: () => {
                return JSON.parse(
                    // Parse the response set cookie header
                    parse(
                        ctx.rawRequest.res.getHeader("Set-Cookie") as string ?? ''
                    ).props

                    // If cookie response is not set get the request cookie header
                    ?? parse(ctx.rawRequest.req.headers.cookie
                        ?? serialize("props", JSON.stringify({}), this.options)
                    ).props
                );
            },

            // Set cookies
            set: (value: { [key: string]: any }) => {
                // Set cookie header
                ctx.rawRequest.res.setHeader("Set-Cookie", serialize("props", JSON.stringify(value), this.options));
            },

            enumerable: true,
            configurable: true,
        });

        // Next middleware
        await next();
    }
}

