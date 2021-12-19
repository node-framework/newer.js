import { NodeServer, Middlewares } from "../../src/main.js";

await new NodeServer()
    .use(Middlewares.renderHTML)
    .useStaticPath("./example/Server")
    .use((req, res) => 
        res.renderSync(req.url) ? void (0) : res.redirect("/index")
    ).start();