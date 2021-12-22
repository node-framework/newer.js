import { NodeServer, Middlewares } from "../../lib/main.js";

await new NodeServer()
    .useStaticPath("./example/Server")
    .use(Middlewares.renderHTML)
    .use(Middlewares.serveStatic())
    .start();