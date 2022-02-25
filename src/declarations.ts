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
     * Get response headers
     */
    header(name: string): string | number | string[];

    /**
     * Set response headers
     */
    header(name: string, value?: string | number | readonly string[]): void;

    /**
     * Set multiple headers
     */
    headers(headers: { [name: string]: string | number | readonly string[] }): void;

    /**
     * Get request headers
     */
    headers(): http.IncomingHttpHeaders;

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

/**
 * Application 
 */
export interface Application {
    /**
     * Start the main application
     */
    start(): Promise<void>;

    /**
     * Set app configs
     * @param configs the configs
     */
    config(configs: AppConfigs): void;
}

/**
 * App configs
 */
export interface AppConfigs {
    /**
     * App root path. Defaults to "."
     */
    projectPath?: string,

    /**
     * Static directory. Defaults to "public"
     */
    static?: string,

    /**
     * HTTP server options
     */
    httpOptions?: {
        /**
         * Server port. Defaults to 80
         */
        port?: number,

        /**
         * Server hostname. Defaults to "localhost"
         */
        hostname?: string,

        /**
         * HTTPS mode. Defaults to false
         */
        httpsMode?: boolean,

        /**
         * HTTP backlog. Defaults to 0
         */
        backlog?: number,

        /**
         * Advanced options
         */
        advanced?: http.ServerOptions | https.ServerOptions
    }
}

/**
 * Cookie options
 */
export interface CookieOptions {
    maxAge?: number;
    decode?(encodedURIComponent: string): string;
    encode?(encodedURIComponent: string): string;
    domain?: string;
    path?: string;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: true | 'lax' | 'strict' | 'none';
}