import { Server, Context, Handler } from "../../../src/main.js";

new Server()
    .route("/", new class implements Handler {
        async invoke(ctx: Context) {
            ctx.response += "Hello";
        };
    })
    .listen(80);