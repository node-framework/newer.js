/// <reference types="node" />
import http from "http";
import qs from "query-string";
export interface Context {
    readonly request: http.IncomingMessage;
    response: string;
    readonly query: {
        [k: string]: string;
    };
    readonly body: qs.ParsedQuery;
    readonly url: string;
}
export interface Handler {
    readonly invoke: (ctx: Context) => Promise<void>;
    readonly method: string;
}
export default class Server {
    private server;
    private staticDir;
    private routes;
    constructor();
    route(routeName: string, route: Handler): this;
    static(path: string): void;
    callback(): (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
    listen(port?: number, host?: string, backlog?: number): Promise<Server>;
    close(): Promise<Server>;
}
