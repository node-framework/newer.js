/// <reference types="node" />
import http from "http";
import https from "https";
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
    /**
     * Server address
     */
    readonly remoteAddress: string;
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
    private staticDir;
    private routes;
    private mds;
    private options;
    private httpsMode;
    /**
     * The constructor
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean);
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
     * Start the server
     * @param port the port to listen to
     * @param hostname the hostname to listen to
     * @param backlog the backlog
     */
    listen(port?: number, hostname?: string, backlog?: number): Promise<void>;
}
