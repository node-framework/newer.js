import http from "http";
import qs from "query-string";
import fs from "fs";

// Get the body of a request
const getBody = async (req: http.IncomingMessage): Promise<qs.ParsedQuery> =>
    new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e7) {
                req.socket.destroy();
                rej();
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
export interface Context {
    /**
     * The request
     */
    readonly request: http.IncomingMessage;
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
     * Content type
     */
    contentType: string;
    /**
     * Redirect to another url
     */
    readonly redirect: (url: string) => void;
    /**
     * Send a file
     */
    readonly writeFile: (path: string) => void;
}

/**
 * A route handler
 */
export interface Handler {
    GET?: (ctx: Context) => Promise<void>,
    POST?: (ctx: Context) => Promise<void>,
    PUT?: (ctx: Context) => Promise<void>,
    DELETE?: (ctx: Context) => Promise<void>
}

export default class Server {
    private server: http.Server;

    private staticDir: string;

    private routes: {
        [routeName: string]: Handler
    };

    /**
     * The constructor
     */
    constructor() {
        this.routes = {};
    }

    /**
     * @param routeName the route name
     * @param route the route handler
     * @returns this server for chaining
     */
    route(routeName: string, route: Handler) {
        this.routes[routeName] = route;
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

    /**
     * @returns a listener that can be use for http.createServer or https.createServer
     */
    callback() {
        return async (req: http.IncomingMessage, res: http.ServerResponse) => {
            // The current status code
            let statusCode: number;
            // Check whether this route has handler
            let hasHandler: boolean = false;
            // The context
            const c: Context = {
                // Default status code
                statusCode: 200,
                // The request
                request: req,
                // The response, default to empty
                response: "",
                // The query of the URL
                query: getQuery(req.url),
                // The body of the request
                body: await getBody(req),
                // The request url
                url: req.url,
                // Default content type
                contentType: "text/plain",
                // Redirect function
                redirect: (url: string) => {
                    // Redirect
                    res.writeHead(307, {
                        "Location": url
                    });
                    // Set status code to 307
                    c.statusCode = 307;
                },
                // Send file
                writeFile: (path: string) => {
                    // Set response to file content
                    c.response += this.readFile(path) ?? "";
                },
            };
            // Favicon
            if (req.url === "/favicon.ico") {
                let dir = this.staticDir ?? ".";
                if (!fs.existsSync(dir + req.url))
                    fs.appendFileSync(dir + req.url, "");
            }
            // Invoke route
            await this.routes[req.url][req.method](c);
            // Set has handler to true
            hasHandler = true;
            // Set the status code
            statusCode = c.statusCode;
            // Set the content type
            res.setHeader("Content-Type", c.contentType);
            // Check whether any route handler has been called
            if (!hasHandler) {
                // Check whether the static dir is set
                if (this.staticDir) {
                    // Set the response to the read data
                    c.response = this.readFile(this.staticDir + req.url);
                }
                // If status code in not set and static dir is not set
                else if (!statusCode)
                    // Set status code to 404
                    statusCode = 404;
            }
            // Check whether content and status code is set
            if (!c.response && !statusCode)
                // Set status code to 404 or 204
                statusCode = c.response === null ? 404 : 204;
            // Write status code
            res.writeHead(statusCode ?? 200);
            // End the response
            res.end(c.response);
        }
    }

    /**
     * Start the server
     * @param port the port to listen to
     * @param host the hostname to listen to
     * @param backlog the backlog
     * @returns this server for chaining
     */
    async listen(port?: number, host?: string, backlog?: number) {
        return new Promise<Server>(res => {
            this.server = http
                .createServer(this.callback())
                .listen(port ?? 8080, host ?? "127.0.0.1", backlog ?? 0, () => res(this));
        });
    }

    /**
     * Close the server
     * @returns this server for chaining
     */
    async close() {
        return new Promise<Server>((res, rej) => {
            this.server.close(err => err ? rej(err) : res(this));
        });
    }
}
