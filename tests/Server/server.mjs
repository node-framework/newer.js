import index from "./index.mjs";
import { Server, SubDomain } from "../../lib/main.js";

// Start the timer
console.time("web");

// Create a server
const app = new Server();

// Register a subdomain handler
app.middleware(
    // Subdomain "index.localhost"
    new SubDomain("index")
        // Register another subdomain handler
        .middleware(
            // Subdomain "sub.index.localhost"
            new SubDomain("sub")
                // Register a route handler
                .middleware(index)
        )
);

// Register a middleware
app.middleware({
    invoke: async (ctx, next) =>  {
        ctx.response += " and Hi";
        await next();
    }
});

// Start the server
app.listen(80);

// End the timer and log the result
console.timeEnd("web");