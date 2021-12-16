import { bodyParser, queryParser, renderHTML } from "./src/middlewares.mjs";
import NodeServer from "./src/nodeserver.mjs";

const mod = {
    NodeServer,
    Middlewares: {
        bodyParser,
        queryParser,
        renderHTML
    }
}

module.exports.default = mod;