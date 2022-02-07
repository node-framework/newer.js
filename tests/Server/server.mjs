import index from "./index.mjs";
import { Server, SubDomain } from "../../lib/main.js";

// Start the timer
console.time("web");

// Create a server
const app = new Server();

// Register the router
app.middleware(
    new SubDomain("index")
        .middleware(
            new SubDomain("sub")
                .middleware(index)
        )
);

// Register a middleware
app.middleware({
    async invoke(ctx, next) {
        ctx.response += " and Hi";
        await next();
    }
});

// Start the server
app.listen(80);

// End the timer and log the result
console.timeEnd("web");