import { Context, Middleware, NextFunction } from "../declarations";

/**
 * Handle a subdomain
 */
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
    middleware(...m: Middleware[]) {
        for (const md of m) {
            if (md instanceof SubDomain)
                md.domain += (md.domain.endsWith(".") ? "" : ".") + this.domain;

            // Add the middleware
            this.mds.push(md);
        }
        return this;
    }

    /**
     * Invoke this subdomain handler
     * @param ctx 
     * @param next 
     */
    async invoke(ctx: Context, next: NextFunction) {
        const __next = async (index: number, max: number) => {
            if (index < max) {
                // When response ended
                if (ctx.responseEnded)
                    // End the function
                    return;

                // When not invoke the middleware
                await this.mds[index + 1]?.invoke(ctx, async () => __next(index + 1, max));
            }
        }

        if (ctx.subhost === this.domain)
            // Invoke the middleware
            await this.mds[0]?.invoke(ctx, async () => __next(0, this.mds.length));

        // End the function
        await next();
    }
}