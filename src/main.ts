import JsonDB, { Schema, SchemaInstance } from "./Database/JsonDB";
import JsonReviver from "./Database/JsonReviver";
import Server, { Context, Handler, Middleware, Method } from "./Server/server";  
import simple, { SimpleOptions } from "./Server/simple";

export { 
    JsonDB, 
    JsonReviver, 
    Server, 
    simple 
};

export type {
    Schema,
    SchemaInstance, 
    Context, 
    Handler, 
    Method, 
    Middleware,
    SimpleOptions
};