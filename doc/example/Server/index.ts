import { Server, Context, Handler } from "../../../src/main";

new Server()
    .route("/", new class implements Handler {
        async invoke(ctx: Context) {
            ctx.response += "Hello";
        };
        readonly method = "Get";
    })
    .listen(80);