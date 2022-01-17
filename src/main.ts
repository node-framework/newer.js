export { default as SimpleServer } from "./Server/deno";

import JsonDB, { Schema, SchemaInstance } from "./Database/JsonDB";
import JsonReviver from "./Database/JsonReviver";
import Server, { Context, Handler, Middleware, Method } from "./Server/server";  
import simple, { Simple } from "./Server/deno";
 
export default { JsonDB, JsonReviver, Server, simple };

export type {
    Schema,
    SchemaInstance, 
    Context, 
    Handler, 
    Method, 
    Middleware,
    Simple
}