import Server from "./types/Server/server";
import Router from "./types/Middleware/router";
import StaticDir from "./types/Middleware/staticdir";
import simple from "./types/Server/simple";
import Cookie from "./types/Middleware/cookie";
import route from "./types/Middleware/route";
import CORS from "./types/Middleware/cors";

export {
    Server,
    Router,
    StaticDir,
    simple,
    Cookie,
    route,
    CORS
}

export * from "./types/declarations";

