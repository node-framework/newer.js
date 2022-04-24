import http from "http";
import net from "net";

// Request methods
export type Method =
    "GET" | "POST" | "PUT" | "DELETE" | "HEAD"
    | "OPTIONS" | "PATCH" | "CONNECT" | "TRACE";

export interface CORSOptions {
    /**
     * Access-Control-Allow-Origin specifies either a single origin which tells browsers to allow that origin to access the resource; 
     * or else — for requests without credentials — the "*" wildcard tells browsers to allow any origin to access the resource.
     */
    allowOrigins?: string | string[];

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


/**
 * Context of a request
 */
export interface Context extends Record<string, any> {
    /**
     * Whether to end the response or not
     */
    toEndResponse: boolean;

    /**
     * End the response manually
     */
    responseEnded: boolean;

    /**
     * The response
     * @default ""
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
    readonly socket: net.Socket;

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
export declare type Handler = {
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
