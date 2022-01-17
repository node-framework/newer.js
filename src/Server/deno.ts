import https from "https";
import http from "http";

export default class SimpleServer {
    private server: http.Server | https.Server;
    private done: boolean;

    /**
     * @param options server options
     * @param httpsMode toggle HTTPS mode
     */
    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean) {
        this.server = (httpsMode ? https : http).createServer(options);
    }

    /**
     * Start the server
     * 
     * @param port Server port
     * @param hostname Server hostname
     * @param backlog Server backlog
     * @returns this object
     */
    listen(port?: number, hostname?: string, backlog?: number) {
        this.server.listen(port, hostname, backlog);
        this.done = false;
        return this
    }

    /**
     * Get requests in asynchronous iterator
     * @returns requests in asynchronous iterator
     */
    requests() {
        let pointer = this;
        return {
            [Symbol.asyncIterator]() {
                return {
                    async next() {
                        return {
                            done: pointer.done,
                            value: await new Promise<{ request: http.IncomingMessage, response: http.ServerResponse }>(
                                (result, reject) => {
                                    pointer.server.on('request', (request, response) =>
                                        result({ request, response })
                                    );

                                    pointer.server.on('error', reject);
                                }
                            )
                        };
                    }
                }
            }
        }
    }

    /**
     * Close the server
     * 
     * @returns this object
     */
    close() {
        this.server.close();
        this.done = true;
        return this;
    }
}