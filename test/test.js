import { NodeServer, Middlewares } from "../main.js";
import calc from "./execTime.js";

calc(
    async () => {
        /**
        * @example 
        * // HTTPS Server 
        * const app = https.createServer({
        *     cert: ...,
        *     key: ...
        * }, server.callback());
        * 
        * app.listen(server.port, server.hostname);
        */
        await new NodeServer()
            // the same as express().use(express.static("test"))
            .useStaticPath("test")
            // Render HTML
            .use(Middlewares.renderHTML)
            // go to /index will render index.html
            .register("/index", async (req, res) =>
                await res.render(req.url)
            )
            // Params
            .register("/name/:name/id/:id", async (req, res) =>
                res.write(`Hello ${req.params.name}, your ID is ${req.params.id}`)
            )
            // Start
            .start()
    }, "Async server"
);
