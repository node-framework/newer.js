import http from "http";
import qs from "query-string";
import { Socket } from "net";
import https from "https";

// Request methods
export type Method =
    "GET" | "POST" | "PUT" | "DELETE" | "HEAD"
    | "OPTIONS" | "PATCH" | "CONNECT" | "TRACE";

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
     * The raw request
     */
    readonly rawRequest: {
        /**
         * Request
         */
        readonly req: http.IncomingMessage;

        /**
         * Response
         */
        readonly res: http.ServerResponse;
    };
    
    /**
     * The subhost
     */
    readonly subhost: string;
}


/**
 * A route handler
 */
export type Handler = {
    [method in Method]?: (ctx: Context) => Promise<void>;
};

/**
 * Next function
 */
export type NextFunction = () => Promise<void>;

/**
 * A middleware
 */
export interface Middleware {
    invoke(ctx: Context, next: NextFunction): Promise<void>;
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

/**
 * The simple server
 */
export interface SimpleServer {
    /**
     * The simple HTTP or HTTPS server
     */
    readonly server: http.Server | https.Server; 

    /**
     * The generator
     */
    [Symbol.asyncIterator](): AsyncGenerator<http.ServerResponse, any, unknown>; 
}


/**
 * Schema instance
 * Result after calling new Schema(obj: object)
 */
export type SchemaInstance = {
    save: () => Promise<object>;
    del: () => Promise<object>;
    update: (obj: object) => Promise<object>;
}

/**
 * Database events
 */
export type DBEvents = "save-item" | "update-item" | "delete-item" |
    "clear-schema" | "clear-database" |
    "drop-database" | "drop-schema"

/**
 * Schema type
 */
export type Schema = {
    new(obj: object): SchemaInstance,
    read: () => object[],
    match: (obj: object) => boolean,
    schem: string,
    find: (obj?: object, count?: number, except?: boolean) => Promise<object[] | object>,
    create: (...obj: object[]) => SchemaInstance[];
    update: (obj: object, updateObj: object) => Promise<object>,
    clear: () => Promise<void>,
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>,
    drop: () => Promise<void>
}