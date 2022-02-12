import { Context, Middleware, NextFunction } from "../declarations";
export default class SubDomain implements Middleware {
    private domain;
    private mds;
    /**
     * @param domain the subdomain to handle
     */
    constructor(domain?: string);
    /**
     * Register a middleware
     * @param m the middleware
     * @returns this middleware for chaining
     */
    middleware(m: Middleware): this;
    /**
     * Invoke this subdomain handler
     * @param ctx
     * @param next
     */
    invoke(ctx: Context, next: NextFunction): Promise<void>;
}
