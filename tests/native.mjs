import http from "http";

// Start the timer
console.time("web");

// Create and start a server
http.createServer().listen(80);

// End the timer
console.timeEnd("web");

// 4.5ms is the average speed
// 3.153ms is the fastest speed
// 9.152ms is the slowest speed