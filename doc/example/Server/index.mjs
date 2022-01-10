import { Server } from "../../../lib/main.js";

// Create the server
await new Server()
    // Homepage
    .route("/", new class Home {
        async invoke(ctx) {
            ctx.response += "Hello"
        }
        method = "Get";
    })
    // Start the server
    .listen(80);