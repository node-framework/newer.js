import { serialize, parse } from "../Utils/cookie.js";
/**
 * Cookie middleware
 */
export default class Cookies {
    options;
    /**
     * @param options Cookie options
     */
    constructor(options) {
        this.options = options ?? {};
    }
    /**
     * @param ctx
     * @param next
     */
    async invoke(ctx, next) {
        // Set cookies 
        Object.defineProperty(ctx, "cookies", {
            // Get cookies
            get: () => {
                return JSON.parse(
                // Parse the response set cookie header
                parse(ctx.rawRequest.res.getHeader("Set-Cookie") ?? '').props
                    // If cookie response is not set get the request cookie header
                    ?? parse(ctx.rawRequest.req.headers.cookie
                        ?? serialize("props", JSON.stringify({}), this.options)).props);
            },
            // Set cookies
            set: (value) => {
                // Set cookie header
                ctx.rawRequest.res.setHeader("Set-Cookie", serialize("props", JSON.stringify(value), this.options));
            },
            enumerable: true,
            configurable: true,
        });
        // Cookie options
        Object.defineProperty(ctx, "cookieOptions", {
            get: () => this.options,
            enumerable: true,
        });
        // Next middleware
        await next();
    }
}
