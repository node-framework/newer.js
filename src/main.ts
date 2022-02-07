// JsonDB
import JsonDB from "./Database/JsonDB";

// JsonDB reviver
import JsonReviver from "./Database/JsonReviver";

// Import all the declarations
import { Context, Handler, Middleware, Method, SimpleOptions, NextFunction, Schema, SchemaInstance } from "./declarations";  

// All servers
import Server from "./Server/server";
import simple from "./Server/simple";

// Middlewares
import Router from "./Middleware/router";
import SubDomain from "./Middleware/subdomain";
import https from "https";
import http from "http";

// Export all the classes and methods
export { JsonDB, JsonReviver, Server, Router, SubDomain, simple };

// Default export
export default Object.assign(
    (options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean) => 
        new Server(options, httpsMode),
    { JsonDB, JsonReviver, Router, SubDomain, simple }
);

// Export all types
export type { Schema, SchemaInstance, Context, Handler, Method, Middleware, SimpleOptions, NextFunction };