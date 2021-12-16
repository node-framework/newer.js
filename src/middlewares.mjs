// @ts-check
const { existsSync, readFile, readFileSync } = require("fs");
const path = require("path");
const qs = require("query-string");

/**
* @param {import("http").ServerResponse} res
* @param {import("./nodeserver.mjs").default} server
* @returns {(pathname: string, callback?: () => void) => Promise<string | boolean>}
*/
const getAsyncRenderer = (res, server) => (
    async (pathname, callback = () => { }) =>
        new Promise((rs, rj) =>
            existsSync(path.join(server.staticPath, pathname + ".html"))
                ? readFile(path.join(server.staticPath, pathname + ".html"),
                    (err, data) => {
                        if (err) rj(err);
                        let dt = data?.toString() ?? "";
                        res.write(dt, callback);
                        rs(dt);
                    })
                // @ts-ignore
                : rs(false)
        )
);

/**
* @param {import("http").ServerResponse} res 
* @param {import("./nodeserver.mjs").default} server
* @returns {(pathname: string, callback?: () => void) => string | boolean}
*/
const getSyncRenderer = (res, server) => (
    (pathname, callback = () => { }) => {
        let data = existsSync(
            path.join(server.staticPath, pathname + (!path.extname(pathname) ? ".html" : ""))
        ) ? readFileSync(
            path.join(server.staticPath, pathname + (!path.extname(pathname) ? ".html" : ""))
            // @ts-ignore
        ).toString() : false;
        res.write(typeof data === "string" ? data : "", callback);
        return data;
    }
)


/**
* @param {any} _ 
* @param {import("http").ServerResponse} res 
* @param {import("./nodeserver.mjs").default} server 
*/
module.exports.renderHTML = (_, res, server) => {
    // Normal render
    // @ts-ignore
    res.render = getAsyncRenderer(res, server);
    // Sync render
    // @ts-ignore
    res.renderSync = getSyncRenderer(res, server);
}

/**
* @param {import("http").IncomingMessage} req 
*/
module.exports.bodyParser = async req =>
    // Body
    // @ts-ignore
    req.body = await new Promise((res, rej) => {
        let body = '';
        req.on('data', data => {
            body += data;
            if (body.length > 1e6) {
                req.socket.destroy();
                rej();
            }
        });
        req.on('end', () => res(qs.parse(body)));
    });

/**
* @param {import("http").IncomingMessage} req 
*/
module.exports.queryParser = req =>
    // Query
    // @ts-ignore
    req.query = Object.fromEntries(
        // @ts-ignore
        new URLSearchParams(req.url.split("?")[1]).entries()
    );


