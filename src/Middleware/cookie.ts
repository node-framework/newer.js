import { serialize, parse } from "../Utils/Cookie";
import { Context, Middleware, NextFunction, CookieOptions } from "../declarations";

declare module '../declarations' {
    interface Context {
        cookie?: {
            [key: string]: any;
        };
        cookieOptions?: CookieOptions;
    }
}

/**
 * Cookie middleware
 */
export default class Cookie implements Middleware {
    readonly options: CookieOptions;

    /**
     * @param options Cookie options
     */
    constructor(options?: CookieOptions) {
        this.options = options ?? {};
    }

    /**
     * @param ctx 
     * @param next 
     */
    async invoke(ctx: Context, next: NextFunction): Promise<void> {
        // Set cookies 
        Object.defineProperty(ctx, "cookie", {
            // Get cookies
            get: () => 
                JSON.parse(
                    // Parse the response set cookie header
                    parse(
                        ctx.rawRequest.res.getHeader("Set-Cookie") as string ?? '', 
                        this.options
                    ).props

                    // If cookie response is not set get the request cookie header
                    ?? parse(ctx.rawRequest.req.headers.cookie
                        ?? serialize("props", JSON.stringify({}), this.options),
                        this.options
                    ).props
                ),

            // Set cookies
            set: (value: { [key: string]: any }) => {
                // Set cookie header
                ctx.rawRequest.res.setHeader("Set-Cookie", serialize("props", JSON.stringify(value), this.options));
            },

            enumerable: true,
            configurable: true,
        });

        // Cookie options
        Object.defineProperty(ctx, "cookieOptions", {
            get: () => 
                this.options,

            enumerable: true,
        });

        // Next middleware
        await next();
    }
}

