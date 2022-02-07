import { Context, Middleware, NextFunction } from "../declarations";

export default class SubDomain implements Middleware {
    private domain: string;
    private mds: Middleware[];

    /**
     * @param domain the subdomain to handle
     */
    constructor(domain: string = ".") {
        this.domain = domain === "." ? "" : domain;
        this.mds = [];
    }

    /**
     * Register a middleware
     * @param m the middleware
     * @returns this middleware for chaining
     */
    middleware(m: Middleware) {
        if (m instanceof SubDomain)
            m.domain = m.domain + (m.domain.endsWith(".") ? "" : ".") + this.domain;
        this.mds.push(m);
        return this;
    }

    /**
     * Invoke this subdomain handler
     * @param ctx 
     * @param next 
     */
    async invoke(ctx: Context, nxt?: NextFunction) {
        const next = async (index: number, max: number) => {
            if (index < max) {
                // When response ended
                if (ctx.responseEnded)
                    // End the function
                    return;

                // When not invoke the middleware
                await this.mds[index + 1]?.invoke(ctx, async () => next(index + 1, max));
            }
        }

        // Invoke the middleware
        await this.mds[0]?.invoke(ctx, async () => next(0, this.mds.length));

        if (nxt)
            // End the function
            await nxt();
    }
}