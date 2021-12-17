import Server from "./src/nodeserver.js";
import mdw from "./src/middlewares.js";
import db from "./src/JsonDB.js";

export const NodeServer = Server,
    Middlewares = mdw,
    JsonDB = db
