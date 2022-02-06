import http from "http";
import https from "https";
import fs from "fs";
import qs from "query-string";
import simple from "./simple";
import { Middleware, Context, Method } from "./declarations";
import Router from "./router";

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

export default class Server {
    private mds: Middleware[];

    private options: http.ServerOptions | https.ServerOptions;

    private httpsMode: boolean;

    private rawServer: http.Server | https.Server;

    private iconPath: string;

    /**
     * The constructor
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean) {
        this.options = options;
        this.httpsMode = httpsMode;
        this.mds = [];
        this.iconPath = "./favicon.ico";
    }

    /**
     * Set the icon path
     * @param path the icon path
     * @returns this server for chaining
     */
    icon(path: string) {
        this.iconPath = path;
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
    async listen(port: number = 80, hostname: string = "localhost", backlog: number = 0) {
        // Get requests
        const requests = simple({
            port,
            hostname,
            backlog,
            options: this.options,
            httpsMode: this.httpsMode
        });

        // Http
        this.rawServer = requests.server;

        // Loop through the requests
        for await (const res of requests) {
            const
                // The request
                { req } = res,

                // The context
                c: Context = {
                    // End the response manually
                    responseEnded: false,

                    // Default status code
                    statusCode: req.statusCode,

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

                    // Server IPv4 address
                    remoteAddress: req.socket.remoteAddress,

                    // Subhost
                    subhost: req.headers.host.slice(0, req.headers.host.lastIndexOf(hostname) - 1)
                };

            // Create favicon if it does not exists
            if (req.url === "/favicon.ico" && !fs.existsSync(this.iconPath))
                fs.appendFileSync(this.iconPath, "");

            // Next function
            const next = async (index: number, max: number) => {
                if (index < max) {
                    // When response ended
                    if (c.responseEnded)
                        // End the function
                        return;

                    // Invoke the middleware
                    await this.mds[index + 1]?.invoke(c, async () => next(index + 1, max));
                }
            }

            // Invoke the middleware
            await this.mds[0]?.invoke(c, async () => next(0, this.mds.length));

            // End the response
            this.endResponse(c, res);
        }
    }

    /**
     * Get the HTTP or HTTPS server
     */
    get http() {
        return this.rawServer;
    }
}