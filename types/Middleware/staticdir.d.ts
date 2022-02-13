import { Context, Middleware, NextFunction } from "../declarations";
/**
 * Serve static files in a specific directory
 */
export default class StaticDir implements Middleware {
    dir: string;
    /**
     * @param dir The target directory
     */
    constructor(dir: string);
    invoke(ctx: Context, next?: NextFunction): Promise<void>;
}
