/// <reference types="node" />
import http from "http";
import qs from "query-string";
import { Socket } from "net";
export declare type Method = "GET" | "POST" | "PUT" | "DELETE";
/**
 * Context of a request
 */
export interface Context extends Record<string, any> {
    /**
     * End the response manually
     */
    responseEnded: boolean;
    /**
     * The response
     */
    response: string;
    /**
     * Status code
     */
    statusCode: number;
    /**
     * Parsed query
     */
    readonly query: {
        [k: string]: string;
    };
    /**
     * Parsed body
     */
    readonly body: qs.ParsedQuery;
    /**
     * The page url
     */
    readonly url: string;
    /**
     * Append a file content to response
     */
    readonly writeFile: (path: string) => void;
    /**
     * Get or set response headers
     */
    readonly header: (name?: string, value?: string | number | readonly string[]) => void | string | number | string[];
    /**
     * Set multiple headers or get request headers
     */
    readonly headers: (headers?: {
        [name: string]: string | number | readonly string[];
    }) => void | http.IncomingHttpHeaders;
    /**
     * Request socket
     */
    readonly socket: Socket;
    /**
     * Request method
     */
    readonly method: Method;
    /**
     * Request HTTP version
     */
    readonly httpVersion: string;
}
/**
 * A route handler
 */
export interface Handler {
    GET?: (ctx: Context) => Promise<void>;
    POST?: (ctx: Context) => Promise<void>;
    PUT?: (ctx: Context) => Promise<void>;
    DELETE?: (ctx: Context) => Promise<void>;
}
/**
 * A middleware
 */
export interface Middleware {
    readonly invoke: (ctx: Context) => Promise<void>;
}
export default class Server {
    private server;
    private staticDir;
    private routes;
    private mds;
    /**
     * The constructor
     */
    constructor();
    /**
     * Register a route
     * @param routeName the route name
     * @param route the route handler
     * @returns this server for chaining
     */
    route(routeName: string, route: Handler): this;
    /**
     * Add middleware
     * @param m middleware
     * @returns this server for chaining
     */
    middleware(m: Middleware): this;
    /**
     * @param path the static path
     * @returns this server for chaining
     */
    static(path: string): this;
    private readFile;
    private endResponse;
    /**
     * @returns a listener that can be use for http.createServer or https.createServer
     */
    callback(): (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
    /**
     * Start the server
     * @param port the port to listen to
     * @param host the hostname to listen to
     * @param backlog the backlog
     * @returns this server for chaining
     */
    listen(port?: number, host?: string, backlog?: number): Promise<Server>;
    /**
     * Close the server
     * @returns this server for chaining
     */
    close(): Promise<Server>;
}
