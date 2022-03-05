"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cookie_js_1 = require("../Utils/Cookie.js");
/**
 * Cookie middleware
 */
class Cookie {
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
        Object.defineProperty(ctx, "cookie", {
            // Get cookies
            get: () => JSON.parse(
            // Parse the response set cookie header
            (0, Cookie_js_1.parse)(ctx.rawRequest.res.getHeader("Set-Cookie") ?? '', this.options).props
                // If cookie response is not set get the request cookie header
                ?? (0, Cookie_js_1.parse)(ctx.rawRequest.req.headers.cookie
                    ?? (0, Cookie_js_1.serialize)("props", JSON.stringify({}), this.options), this.options).props),
            // Set cookies
            set: (value) => {
                // Set cookie header
                ctx.rawRequest.res.setHeader("Set-Cookie", (0, Cookie_js_1.serialize)("props", JSON.stringify(value), this.options));
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
exports.default = Cookie;
