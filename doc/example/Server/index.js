import { Server } from "../../../lib/main.js";

class Home {
    async invoke(ctx) {
        ctx.response += "Hello"
    }
    method = "get";
}

// Create the server
await new Server()
    // Homepage
    .route("/", new Home())
    // Start the server
    .listen(80);