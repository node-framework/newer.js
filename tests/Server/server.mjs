import index from "./index.mjs";
import newer from "../../lib/main.js";

// Start the timer
console.time("web");

// Create a server
const app = newer();

// Register a subdomain handler
app.middleware(
    // Subdomain "index.localhost"
    new newer.SubDomain("index")
        // Register another subdomain handler
        .middleware(
            // Subdomain "sub.index.localhost"
            new newer.SubDomain("sub")
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