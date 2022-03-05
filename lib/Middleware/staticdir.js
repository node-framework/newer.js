"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Serve static files in a specific directory
 */
class StaticDir {
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
            ctx.response = await fs_1.default.promises
                .readFile(path_1.default.join(this.dir, ctx.url))
                .then(v => v?.toString() ?? "")
                .catch(() => "");
        // End the response if the response is not empty
        if (ctx.response && ctx.response !== "")
            ctx.responseEnded = true;
        // Next middleware
        await next();
    }
}
exports.default = StaticDir;
