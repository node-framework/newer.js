// Import simple function
import { simple } from "../lib/main.js";

// Start the timer
console.time("web");

// Create and start a server
const server = simple();

// End the timer and log the time that `simple` needs to start the server 
console.timeEnd("web");

// Handle requests from server
for await (const { request, response } of server) {
    response.end(request.url);
}

// 0.5 is the average speed
// 0.237ms is the fastest speed 
// 1.016ms is the slowest speed