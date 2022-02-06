import { Context, Middleware, NextFunction } from "./declarations";
import Router from "./router";

export default class SubDomain implements Middleware {
    private domain: string;
    private handler: Router;

    /**
     * @param domain the subdomain to handle
     */
    constructor(domain: string = ".", handler: Router) {
        this.domain = domain === "." ? "" : domain;
        this.handler = handler;
    }

    /**
     * Invoke this subdomain handler
     * @param ctx 
     * @param next 
     */
    async invoke(ctx: Context, next?: NextFunction) {
        if (ctx.subhost === this.domain)
            // Invoke the handler
            await this.handler.invoke(ctx);

        // Else, call the next middleware
        if (next) 
            // End the middleware
            await next();
    }
}