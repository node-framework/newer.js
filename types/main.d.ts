import JsonDB from "./Database/JsonDB";
import { Context, Handler, Middleware, Method, SimpleOptions, NextFunction, Schema, SchemaInstance } from "./declarations";
import Server from "./Server/server";
import simple from "./Server/simple";
import Router from "./Middleware/router";
import SubDomain from "./Middleware/subdomain";
import StaticDir from "./Middleware/staticdir";
export { JsonDB, Server, Router, SubDomain, StaticDir, simple };
export type { Schema, SchemaInstance, Context, Handler, Method, Middleware, SimpleOptions, NextFunction };
