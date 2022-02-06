import { Context, Middleware, NextFunction } from "./declarations";
import Router from "./router";
export default class SubDomain implements Middleware {
    private domain;
    private handler;
    /**
     * @param domain the subdomain to handle
     */
    constructor(domain: string, handler: Router);
    /**
     * Invoke this subdomain handler
     * @param ctx
     * @param next
     */
    invoke(ctx: Context, next?: NextFunction): Promise<void>;
}
