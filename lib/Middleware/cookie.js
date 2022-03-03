"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cookie_js_1 = require("../Utils/Cookie.js");
/**
 * Cookie middleware
 */
class Cookie {
    /**
     * @param options Cookie options
     */
    constructor(options) {
        this.options = options !== null && options !== void 0 ? options : {};
    }
    /**
     * @param ctx
     * @param next
     */
    async invoke(ctx, next) {
        // Set cookies 
        Object.defineProperty(ctx, "cookie", {
            // Get cookies
            get: () => {
                var _a, _b, _c;
                return JSON.parse(
                // Parse the response set cookie header
                (_b = (0, Cookie_js_1.parse)((_a = ctx.rawRequest.res.getHeader("Set-Cookie")) !== null && _a !== void 0 ? _a : '', this.options).props) !== null && _b !== void 0 ? _b : (0, Cookie_js_1.parse)((_c = ctx.rawRequest.req.headers.cookie) !== null && _c !== void 0 ? _c : (0, Cookie_js_1.serialize)("props", JSON.stringify({}), this.options), this.options).props);
            },
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
