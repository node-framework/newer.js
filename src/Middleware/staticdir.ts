import fs from "fs";
import path from "path";
import { Context, Middleware, NextFunction } from "../declarations";

export default class StaticDir implements Middleware {
    /**
     * @param dir The target directory
     */
    constructor(public dir: string) {
    }

    async invoke(ctx: Context, next?: NextFunction): Promise<void> {
        // If response hasn't been written
        if (!ctx.response) 
            // Write the response with the file
            ctx.response = await fs.promises
                .readFile(path.join(this.dir, ctx.url))
                .then(v => v?.toString() ?? "")
                .catch(() => "");
            
        // Next middleware
        await next();
    }
}