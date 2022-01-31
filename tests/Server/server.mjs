import index from "./index.mjs";
import { Server } from "../../lib/main.js";

// Start the timer
console.time("web");

// Create a server
const app = new Server();

// Static path
app.static("./tests/Server/public");

// Register a subdomain handler
app.sub("another", index);

// Start the server
app.listen(80);

// End the timer and log the result
console.timeEnd("web");