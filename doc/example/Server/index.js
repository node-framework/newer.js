import { Server } from "../../../lib/main.js";

class Home {
    invoke(ctx) {
        ctx.response += "Hello"
    }
}

// Create the server
await new Server()
    // Homepage
    .route("/", new Home())
    // Start the server
    .listen(80);