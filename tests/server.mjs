import { Server } from "../lib/main.js";

// Start the timer
console.time("web");

// Create a server
const app = new Server();

// Static path
app.static("./tests/public");

// Register a middleware
app.middleware({
    invoke: async ctx => {
        // Set response as route name
        ctx.response += ctx.url
    }
});

// Start the server
app.listen(80);

// End the timer and log the result
console.timeEnd("web");