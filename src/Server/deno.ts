import https from "https";
import http from "http";

export default class Server {
    readonly server: http.Server | https.Server;
    private done: boolean;

    constructor(options?: http.ServerOptions | https.ServerOptions, httpsMode?: boolean) {
        this.server = (httpsMode ? https : http).createServer(options);
    }

    listen(port?: number, hostname?: string, backlog?: number) {
        this.server.listen(port, hostname, backlog);
        this.done = false;
    }

    requests() {
        let pointer = this;
        return {
            [Symbol.asyncIterator]() {
                return {
                    async next() {
                        return {
                            done: pointer.done,
                            value: await new Promise<{request: http.IncomingMessage, response: http.ServerResponse}>(result => {
                                pointer.server.on('request', (request, response) => 
                                    result({request, response})
                                );
                            })
                        };
                    }
                }
            }
        }
    }

    close() {
        this.server.close();
        this.done = true;
    }
}