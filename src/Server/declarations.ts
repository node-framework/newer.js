import http from "http";
import qs from "query-string";
import { Socket } from "net";
import https from "https";

// Request methods
export type Method = "GET" | "POST" | "PUT" | "DELETE";

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
    writeFile(path: string): void;
    /**
     * Get or set response headers
     */
    header(name?: string, value?: string | number | readonly string[]): void | string | number | string[];
    /**
     * Set multiple headers or get request headers
     */
    headers(headers?: { [name: string]: string | number | readonly string[] }): void | http.IncomingHttpHeaders;
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
     * Server IPv4 address
     */
    readonly remoteAddress: string;
    /**
     * The subhost
     */
    readonly subhost: string;
}

/**
 * A route handler
 */
export interface Handler {
    GET?(ctx: Context): Promise<void>,
    POST?(ctx: Context): Promise<void>,
    PUT?(ctx: Context): Promise<void>,
    DELETE?(ctx: Context): Promise<void>,
}

/**
 * A middleware
 */
export interface Middleware {
    invoke(ctx: Context): Promise<void>;
}

/**
 * Server options
 */
export interface SimpleOptions {
    /**
     * Server options
     */
    options?: http.ServerOptions | https.ServerOptions,
    /**
     * Toggle HTTPS mode
     */
    httpsMode?: boolean,
    /**
     * Target port
     */
    port?: number,
    /**
     * Target hostname
     */
    hostname?: string,
    /**
     * Backlog
     */
    backlog?: number
}