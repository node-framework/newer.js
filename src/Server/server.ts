import http from "http";
import https from "https";
import fs from "fs";
import simple from "./simple";
import { Middleware, Context, Method } from "../declarations";
import { getBody, getQuery } from "../Utils/BodyParser";
import endResponse from "../Utils/EndResponse";
import setCookie from "../Utils/SetCookie";

interface Server {
    /**
     * The request handler
     * @param req The request
     * @param res The response
     */
    (req: http.IncomingMessage, res: http.ServerResponse): Promise<void>
}

class Server extends Function {
    private mds: Middleware[];

    private afterInvokeCb: (ctx: Context) => Promise<void> | void;

    private options: http.ServerOptions | https.ServerOptions;

    private httpsMode: boolean;

    private rawServer: http.Server | https.Server;

    private iconPath: string;

    /**
     * Create an HTTP server instance
     */
    constructor();

    /**
     * Create an HTTP server instance
     * @param options The HTTP server options
     */
    constructor(options: http.ServerOptions);

    /**
     * Create an HTTPS server instance
     * @param httpsMode if set to true, the server instance will be created as an HTTPS server
     */
    // @ts-ignore
    constructor(httpsMode: true);

    /**
     * Create an HTTP server instance
     * @param httpsMode if set to true, the server instance will be created as an HTTPS server
     */
    constructor(httpsMode: false);

    /**
     * Create an HTTPS server instance
     * @param options The HTTPS server options
     * @param httpsMode if set to true, the server instance will be created as an HTTPS server
     */
    constructor(options: https.ServerOptions, httpsMode: true);

    /**
     * Create an HTTP server instance
     * @param options The server options
     * @param httpsMode if set to true, the server instance will be created as an HTTPS server
     */
    constructor(options: http.ServerOptions, httpsMode: false);

    /**
     * The constructor
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean) {
        super();

        if (typeof options === "boolean" && !httpsMode)
            this.httpsMode = options;
        else {
            this.options = options;
            this.httpsMode = httpsMode;
        }
        this.mds = [];
        this.iconPath = "./favicon.ico";
        this.afterInvokeCb = () => { };

        return new Proxy(this, {
            apply(target, _, argArray) {
                // @ts-ignore
                return target.cb(...argArray);
            },
        });
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
     * Called when finish invoking the middleware
     * @param cb a callback
     * @returns this server for chaining
     */
    afterInvoke(cb: (ctx: Context) => Promise<void> | void) {
        this.afterInvokeCb = cb;
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

    /**
     * Return the request listener
     * @param req The request
     * @param res The response
     */
    async cb(req: http.IncomingMessage, res: http.ServerResponse) {
        // The context
        const c: Context = {
            // Raw request
            rawRequest: {
                req, res
            },

            // End the response manually
            responseEnded: false,

            // Default status code
            statusCode: undefined,

            // The response, default to empty string
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
                c.response = this.readFile(path) ?? "";
            },

            // Header get and set
            header(name: string, value?: string | number | readonly string[]) {
                // Get or set a header
                return value
                    ? void res.setHeader(name, value)
                    : req.headers[name];
            },

            // Set multiple headers or get request headers
            headers(headers?: { [name: string]: string | number | readonly string[] }) {
                if (!headers)
                    return req.headers;
                for (let name in headers)
                    res.setHeader(name, headers[name]);
            },

            // Redirect
            redirect(url) {
                c.statusCode = 302;
                c.header("Location", url);
            },

            // Socket
            socket: res.socket,

            // Method
            method: req.method as Method,

            // HTTP version
            httpVersion: req.httpVersion,

            // Server IPv4 address
            remoteAddress: req.socket.remoteAddress,
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

        // Invoke the after invoke callback
        if (!c.responseEnded)
            await this.afterInvokeCb(c);

        // Set cookie
        setCookie(c, res);

        // End the response
        endResponse(c, res);
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

        // Make this process asynchronously run
        (async () => {
            // Loop through the requests
            for await (const res of requests)
                await this.cb(res.req, res);
        })().catch(e => {
            if (e)
                throw e;
        });

        // Wait until the server is ready
        await new Promise<void>(res =>
            requests.server.once("listening", res)
        );

        // Http server
        this.rawServer = requests.server;
    }

    /**
     * Get the HTTP or HTTPS server
     */
    get http() {
        return this.rawServer;
    }
}

export default Server;