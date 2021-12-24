import { NodeServer, Middlewares } from "../../lib/main.js";

// Create the server
await new NodeServer()
    // Use static path
    .useStaticPath("./example/Server")
    // Use renderHTML middleware to render HTML 
    // using res.render and res.renderSync
    .use(Middlewares.renderHTML)
    // Use serve static to auto render HTML page
    // Example: /index -> render index.html
    .use(Middlewares.serveStatic())
    // Start the server
    .start();