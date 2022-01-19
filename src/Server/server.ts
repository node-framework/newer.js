import http from "http";
import https from "https";
import qs from "query-string";
import fs from "fs";
import { Socket } from "net";
import simple from "./deno";

// Request methods
export type Method = "GET" | "POST" | "PUT" | "DELETE";

// Get the body of a request
const getBody = async (req: http.IncomingMessage): Promise<qs.ParsedQuery> =>
    new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e7) {
                req.socket.destroy();
                rej("Request data to long");
            }
        });
        req.on('end', () => res(qs.parse(body)));
    });

// Get query of an URL
const getQuery = (url: string) =>
    Object.fromEntries(
        new URLSearchParams(url.split("?")[1]).entries()
    );

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
    readonly headers: (headers?: { [name: string]: string | number | readonly string[] }) => void | http.IncomingHttpHeaders;
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
    GET?: (ctx: Context) => Promise<void>,
    POST?: (ctx: Context) => Promise<void>,
    PUT?: (ctx: Context) => Promise<void>,
    DELETE?: (ctx: Context) => Promise<void>,
}

/**
 * A middleware
 */
export interface Middleware {
    readonly invoke: (ctx: Context) => Promise<void>;
}

export default class Server {
    private staticDir: string;

    private routes: {
        [routeName: string]: Handler
    };

    private mds: Middleware[];

    private options: http.ServerOptions | https.ServerOptions;

    private httpsMode: boolean;

    /**
     * The constructor
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean) {
        this.options = options;
        this.httpsMode = httpsMode;
        this.routes = {};
        this.mds = [];
    }

    /**
     * Register a route
     * @param routeName the route name
     * @param route the route handler
     * @returns this server for chaining
     */
    route(routeName: string, route: Handler) {
        this.routes[routeName] = route;
        return this;
    }

    /**
     * Add middleware
     * @param m middleware 
     * @returns this server for chaining
     */
    middleware(m: Middleware) {
        this.mds.push(m);
        return this;
    }

    /** 
     * @param path the static path
     * @returns this server for chaining
     */
    static(path: string) {
        this.staticDir = path;
        return this;
    }

    // Read file if file not found return null
    private readFile(path: string): string | null {
        try {
            return fs.readFileSync(path).toString();
        } catch (e) {
            return null;
        }
    }

    // End the response
    private endResponse(ctx: Context, res: http.ServerResponse) {
        // Check whether content and status code is set
        if (!ctx.response && !ctx.statusCode)
            // Set status code to 404 or 204
            ctx.statusCode = ctx.response === null ? 404 : 204;

        // Write status code 
        res.writeHead(ctx.statusCode ?? 200);

        // End the response
        res.end(ctx.response);
    }

    /**
     * Start the server
     * @param port the port to listen to
     * @param hostname the hostname to listen to
     * @param backlog the backlog
     */
    async listen(port?: number, hostname?: string, backlog?: number) {
        for await (const { request: req, response: res } of simple({
            port, 
            hostname, 
            backlog, 
            options: this.options
        })) {
            // The context
            const c: Context = {
                // End the response manually
                responseEnded: false,

                // Default status code
                statusCode: undefined,

                // The response, default to empty
                response: "",

                // The query of the URL
                query: getQuery(req.url),

                // The body of the request
                body: await getBody(req),

                // The request url
                url: req.url,

                // Append file content
                writeFile: path => {
                    // Append file content to response
                    c.response += this.readFile(path) ?? "";
                },

                // Header get and set
                header: (name, value) =>
                    // Get or set a header
                    value
                        ? void res.setHeader(name, value)
                        : res.getHeader(name),

                // Set multiple headers or get request headers
                headers: headers => {
                    if (!headers)
                        return req.headers;
                    for (let name in headers)
                        res.setHeader(name, headers[name])
                },

                // Socket
                socket: res.socket,

                // Method
                method: req.method as Method,

                // HTTP version
                httpVersion: req.httpVersion,

                // Server address
                remoteAddress: req.socket.remoteAddress,
            };

            // Invoke middlewares
            for (let md of this.mds) {
                // Invoke the middleware with current context
                await md.invoke(c);

                // Check whether response ended
                if (c.responseEnded) {
                    // End the response
                    this.endResponse(c, res);

                    // End the function
                    return;
                }
            }

            // Favicon
            if (req.url === "/favicon.ico") {
                // Get parent directory
                let path = (this.staticDir ?? ".") + req.url;

                // Create favicon if it does not exists
                if (!fs.existsSync(path))
                    fs.appendFileSync(path, "");
            }

            // Get the route
            const target = this.routes[req.url];

            // Check whether this route has been registered
            if (target && target[req.method])
                // Invoke route
                await target[req.method](c);

            // Check whether response ended
            if (c.responseEnded) {
                this.endResponse(c, res);
                return;
            }

            // Check whether response is not empty
            if (!c.response) {
                // Check whether the static dir is set
                if (this.staticDir) {
                    // Set the response to the read data
                    c.response = this.readFile(this.staticDir + req.url);
                }

                // If status code in not set and static dir is not set
                else if (!c.statusCode)
                    // Set status code to 404
                    c.statusCode = 404;
            }

            // End the response
            this.endResponse(c, res);
        }
    }
}
