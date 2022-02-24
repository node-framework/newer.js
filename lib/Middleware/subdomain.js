/**
 * Handle a subdomain
 */
export default class SubDomain {
    domain;
    mds;
    /**
     * @param domain the subdomain to handle
     */
    constructor(domain = ".") {
        this.domain = domain === "." ? "" : domain;
        this.mds = [];
    }
    /**
     * Register a middleware
     * @param m the middleware
     * @returns this middleware for chaining
     */
    middleware(m) {
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
    async invoke(ctx, next) {
        const __next = async (index, max) => {
            if (index < max) {
                // When response ended
                if (ctx.responseEnded)
                    // End the function
                    return;
                // When not invoke the middleware
                await this.mds[index + 1]?.invoke(ctx, async () => __next(index + 1, max));
            }
        };
        if (ctx.subhost === this.domain)
            // Invoke the middleware
            await this.mds[0]?.invoke(ctx, async () => __next(0, this.mds.length));
        // End the function
        await next();
    }
}
