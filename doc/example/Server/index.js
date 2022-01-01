import { NodeServer } from "../../../lib/main.js";

console.time("App");
// Create the server
await new NodeServer()
    // Homepage
    .register("/", (req, res, raise) => {
        res.write("Hello world");
    })
    // Start the server
    .start();
console.timeEnd('App');