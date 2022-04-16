import { Context, CORSOptions, Middleware, NextFunction } from "../declarations";

export default class CORS implements Middleware {
    private readonly options: CORSOptions;

    constructor(options?: CORSOptions) {
        this.options = options ?? {};
    }

    async invoke(ctx: Context, next: NextFunction) {
        // Headers 
        const headers = {
            "Access-Control-Allow-Origin": this.options.allowOrigin ?? "*",
            "Access-Control-Allow-Methods": this.options.allowMethods?.join(", ") ?? "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        };
        if (this.options.maxAge)
            headers["Access-Control-Max-Age"] = this.options.maxAge;
        if (this.options.allowCredentials)
            headers["Access-Control-Allow-Credentials"] = "true";
        if (this.options.allowHeaders)
            headers["Access-Control-Allow-Headers"] = this.options.allowHeaders.join(", ");
        if (this.options.exposeHeaders)
            headers["Access-Control-Expose-Headers"] = this.options.exposeHeaders.join(", ");
        if (this.options.allowOrigin && this.options.allowOrigin !== "*")
            headers["Vary"] = "Origin";

        // Set headers and continue
        ctx.headers(headers);
        await next();
    }
}