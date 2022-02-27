import { Context, Middleware, NextFunction, CookieOptions } from "../declarations.js";
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
    constructor(options?: CookieOptions);
    /**
     * @param ctx
     * @param next
     */
    invoke(ctx: Context, next: NextFunction): Promise<void>;
}
