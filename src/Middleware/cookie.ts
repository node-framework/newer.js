import { serialize, parse } from "cookie";
import { Context, Middleware, NextFunction, CookieOptions } from "../declarations";

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
        const currentCookie = JSON.parse(
            // Parse the response set cookie header
            parse(
                ctx.rawRequest.req.headers.cookie ?? '', 
                this.options
            ).props

            // If cookie response is not set get the request cookie header
            ?? parse(ctx.rawRequest.req.headers.cookie
                ?? serialize("props", JSON.stringify({}), this.options),
                this.options
            ).props
        );

        // Option fields
        const optionFields = ["maxAge", "expires", "path", "domain", "secure", "httpOnly", "sameSite", "encode", "decode"];

        // Cookie
        const cookie = new Proxy(typeof currentCookie === "object" ? currentCookie : {}, {
            get: (target, key) => {
                if (optionFields.includes(key.toString())) 
                    return this.options[key];

                // Get cookie
                return target[key.toString()];
            },

            set: (target, key, value) => {
                if (key in optionFields)
                    throw new Error("Cannot set cookie options");

                // Set cookie
                target[key as string] = value;
                return true;
            }
        });
        Object.defineProperty(ctx, "cookie", {
            get() {
                return cookie;
            }
        });

        // Next middleware
        await next();
    }
}

