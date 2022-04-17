import http from "http";
import { Socket } from "net";
import https from "https";

// Request methods
export type Method =
    "GET" | "POST" | "PUT" | "DELETE" | "HEAD"
    | "OPTIONS" | "PATCH" | "CONNECT" | "TRACE";

// Declare a schema type
export type SchemaType = {
    (obj: any): boolean;
}

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
    response: any;

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
    readonly body: {
        [k: string]: string;
    };

    /**
     * The page pathname and query
     */
    readonly url: string;

    /**
     * Set the response to the file content
     */
    writeFile(path: string): void;

    /**
     * Get request headers
     */
    header(name: string): string | number | string[];

    /**
     * Set response headers
     */
    header(name: string, value: string | number | readonly string[]): void;

    /**
     * Set multiple response headers
     */
    headers(headers: { [name: string]: string | number | readonly string[] }): void;

    /**
     * Get request headers
     */
    headers(): http.IncomingHttpHeaders;

    /**
     * Redirect to another url
     */
    redirect(url: string): void;

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
     * Current cookie
     */
    readonly cookie?: {
        [key: string]: any;
    } & CookieOptions;
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
    /**
     * Save the created object to the database
     */
    save(): Promise<object>;
}

/**
 * Schema type
 */
export type Schema = {
    /**
     * Create a new schema instance
     * @param obj The initial object
     */
    new(obj: any): SchemaInstance,

    /**
     * Read the schema from the database
     */
    read(): any[],

    /**
     * Find objects that match the parameter object
     * @param obj The object to check
     * @param count The number of objects to return
     * @param except If set to true, find objects that do not match the parameter object
     */
    find(obj?: any, count?: number, except?: boolean): Promise<any[]>,

    /**
     * Find an object that match the parameter object
     * @param obj The object to check
     * @param except If set to true, find the object that do not match the parameter object
     */
    findOne(obj?: any, except?: boolean): Promise<any>,

    /**
     * Create new objects and check whether they match the schema
     * @param obj Objects to check
     */
    create(...obj: any[]): SchemaInstance[],

    /**
     * Find the parameter object in the database and update it with the updated object
     * @param obj the object to be updated
     * @param updateObj the updated object
     */
    update(obj: any, updateObj: any): Promise<void>,

    /**
     * Clear the objects that belongs to the schema
     */
    clear(): Promise<void>,

    /**
     * Delete all objects that matches the parameter object
     * @param obj The object to check
     * @param except If set to true, delete all objects that do not match the parameter object
     */
    deleteMatch(obj?: any, except?: boolean): Promise<void>;

    /**
     * Drop all the objects that belongs to the schema. The schema after this action will be unusable
     */
    drop(): Promise<void>;

    /**
     * Remove all duplicates
     */
    rmDups(): Promise<void>;
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
    /**
     * Cookie maxAge in seconds.
     */
    readonly maxAge?: number;

    /**
     * Decode the cookie
     * @param str The string to decode
     */
    decode?(str: string): string;

    /**
     * Encode the cookie
     * @param str The string to encode
     */
    encode?(str: string): string;

    /**
     * Cookie domain
     */
    readonly domain?: string;

    /**
     * Cookie path
     */
    readonly path?: string;

    /**
     * Cookie expires date
     */
    readonly expires?: Date;

    /**
     * If set to true, the cookie cannot be accessed through document.cookie
     */
    readonly httpOnly?: boolean;

    /**
     * If set to true, the cookie is available only in HTTPS
     */
    readonly secure?: boolean;

    /**
     * Cookie same site. Defaults to "lax"
     */
    readonly sameSite?: true | 'lax' | 'strict' | 'none';
}

export interface CORSOptions {
    /**
     * Access-Control-Allow-Origin specifies either a single origin which tells browsers to allow that origin to access the resource; 
     * or else — for requests without credentials — the "*" wildcard tells browsers to allow any origin to access the resource.
     */
    allowOrigin?: string;

    /**
     * The Access-Control-Allow-Methods header specifies the method or methods allowed when accessing the resource. 
     * This is used in response to a preflight request.
     */
    allowMethods?: Method[];

    /**
     * The Access-Control-Expose-Headers header adds the specified headers to the allowlist that 
     * JavaScript (such as `getResponseHeader()`) in browsers is allowed to access.
     */
    exposeHeaders?: string[];

    /**
     * The Access-Control-Max-Age header indicates how long the results of a preflight request can be cached.
     */
    maxAge?: number;

    /**
     * The Access-Control-Allow-Credentials header indicates whether or not the response to the request can be exposed when the credentials flag is true. 
     * When used as part of a response to a preflight request, this indicates whether or not the actual request can be made using credentials. 
     * Note that simple GET requests are not preflighted, and so if a request is made for a resource with credentials, if this header is not 
     * returned with the resource, the response is ignored by the browser and not returned to web content.
     */
    allowCredentials?: boolean;

    /**
     * The Access-Control-Allow-Headers header is used in response to a preflight request 
     * to indicate which HTTP headers can be used when making the actual request.
     */
    allowHeaders?: string[];
}