// Import simple function
import { simple } from "../lib/main.js";

// Start the timer
console.time("web");

// Create a server
const server = simple();

// End the timer and log the result
console.timeEnd("web");

// Handle requests from server
for await (const { request, response } of server) {
    response.end(request.url);
}