import fs from "fs";
import path from "path";
/**
 * Serve static files in a specific directory
 */
export default class StaticDir {
    dir;
    /**
     * @param dir The target directory
     */
    constructor(dir) {
        this.dir = dir;
    }
    async invoke(ctx, next) {
        // If response hasn't been written
        if (!ctx.response)
            // Write the response with the file
            ctx.response = await fs.promises
                .readFile(path.join(this.dir, ctx.url))
                .then(v => v?.toString() ?? "")
                .catch(() => "");
        // End the response if the response is not empty
        if (ctx.response && ctx.response !== "")
            ctx.responseEnded = true;
        // Next middleware
        await next();
    }
}
