import { Context, Handler } from "../../src/main";

export default class IndexRoute implements Handler {
    async GET(ctx: Context) {
        ctx.response += "Hello world";
        ctx.responseEnded = true;
    }
}