import { NodeServer } from "../../../lib/main.js";

// Create the server
await new NodeServer({
    port: 80
})
    // Homepage
    .register("/index", (req, res, raise) => {
        res.end("Hello world");
    })
    // Start the server
    .start();