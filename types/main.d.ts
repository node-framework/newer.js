import JsonDB from "./Database/JsonDB";
import JsonReviver from "./Database/JsonReviver";
import { Context, Handler, Middleware, Method, SimpleOptions, NextFunction, Schema, SchemaInstance } from "./declarations";
import Server from "./Server/server";
import simple from "./Server/simple";
import Router from "./Middleware/router";
import SubDomain from "./Middleware/subdomain";
import https from "https";
import http from "http";
export { JsonDB, JsonReviver, Server, Router, SubDomain, simple };
declare const _default: ((options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean) => Server) & {
    JsonDB: typeof JsonDB;
    JsonReviver: typeof JsonReviver;
    Router: typeof Router;
    SubDomain: typeof SubDomain;
    simple: typeof simple;
};
export default _default;
export type { Schema, SchemaInstance, Context, Handler, Method, Middleware, SimpleOptions, NextFunction };
