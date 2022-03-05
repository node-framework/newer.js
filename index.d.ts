import Application from "./lib/Application/application.js";
import Server from "./lib/Server/server.js";
import Router from "./lib/Middleware/router.js";
import StaticDir from "./lib/Middleware/staticdir.js";
import simple from "./lib/Server/simple.js";
import SubDomain from "./lib/Middleware/subdomain.js";
import Cookie from "./lib/Middleware/cookie.js";
import JsonDB from "./lib/Database/JsonDB.js";

namespace NewerJS {
    export {
        Application,
        Server,
        Router,
        StaticDir,
        simple,
        SubDomain,
        Cookie,
        JsonDB
    }
    export const app: Application;
}

export default NewerJS;