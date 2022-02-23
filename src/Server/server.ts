import http from "http";
import https from "https";
import fs from "fs";
import simple from "./simple";
import { Middleware, Context, Method } from "../declarations";
import { getBody, getQuery } from "../Utils/BodyParser";

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
    middleware(...m: Middleware[]) {
        // Add middleware
        this.mds.push(...m);

        // Return this server for chaining
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
        if (!ctx.response && !ctx.statusCode) {
            // Set status code to 404
            ctx.statusCode = 404;

            // Set the response
            ctx.response = "Cannot " + ctx.method + " " + ctx.url;
        }

        // Write status code 
        res.writeHead(ctx.statusCode ?? 200);

        // End the response
        res.end(ctx.response ?? "");
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
                    // Raw request
                    rawRequest: {
                        req, res
                    },

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

            // Check whether the request is a favicon
            if (req.url === "/favicon.ico")
                c.response = this.readFile(this.iconPath) ?? "";

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