import Server from "./src/Server/server";
import Router from "./src/Middleware/router";
import StaticDir from "./src/Middleware/staticdir";
import simple from "./src/Server/simple";
import Cookie from "./src/Middleware/cookie";
import route from "./src/Middleware/route";
import CORS from "./src/Middleware/cors";

export {
    Server,
    Router,
    StaticDir,
    simple,
    Cookie,
    route,
    CORS
}

export * from "./src/declarations";

