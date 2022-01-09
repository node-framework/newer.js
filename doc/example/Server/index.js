import { Server } from "../../../lib/main.js";

class Home {
    invoke(ctx) {
        ctx.response += "Hello world"
    }
}

// Create the server
await new Server()
    // Homepage
    .route("/index", new Home())
    // Start the server
    .listen(80);