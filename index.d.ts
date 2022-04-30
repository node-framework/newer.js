import Server from "./types/Server/server";
import Router from "./types/Middleware/router";
import StaticDir from "./types/Middleware/staticdir";
import Cookie from "./types/Middleware/cookie";
import route from "./types/Middleware/route";
import CORS from "./types/Middleware/cors";

export {
    Server,
    Router,
    StaticDir,
    Cookie,
    route,
    CORS
}

export * from "./types/declarations";

