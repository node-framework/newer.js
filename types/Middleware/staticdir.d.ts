import { Context, Middleware, NextFunction } from "../declarations";
export default class StaticDir implements Middleware {
    dir: string;
    /**
     * @param dir The target directory
     */
    constructor(dir: string);
    invoke(ctx: Context, next?: NextFunction): Promise<void>;
}
