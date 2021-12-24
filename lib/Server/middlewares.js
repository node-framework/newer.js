import { existsSync, readFile, readFileSync } from "fs";
import { join, extname } from "path";
import { parse } from "query-string";
const getAsyncRenderer = (_, res, server) => (async (pathname, callback = () => { }) => new Promise((rs, rj) => existsSync(join(server.staticPath, pathname + ".html"))
    ? readFile(join(server.staticPath, pathname + ".html"), (err, data) => {
        if (err)
            rj(err);
        res.write(data, callback);
        rs(data.toString());
    })
    : rs(false)));
const getSyncRenderer = (_, res, server) => ((pathname, callback = () => { }) => {
    let data = existsSync(join(server.staticPath, pathname + (!extname(pathname) ? ".html" : ""))) ? readFileSync(join(server.staticPath, pathname + (!extname(pathname) ? ".html" : ""))
    // @ts-ignore
    ).toString() : false;
    res.write(typeof data === "string" ? data : "", callback);
    return data;
});
/**
 * Render and renderSync
 */
const renderHTML = (_, res, server) => {
    // Normal render
    // @ts-ignore
    res.render = getAsyncRenderer(_, res, server);
    // Sync render
    // @ts-ignore
    res.renderSync = getSyncRenderer(_, res, server);
};
/**
* @param {import("http").IncomingMessage} req
*/
const bodyParser = async (req) => 
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
    req.on('end', () => res(parse(body)));
});
/**
 * Require renderHTML to work
 */
const serveStatic = (home = "/index") => async (req, res) => 
// @ts-ignore
(await res.render(req.url)) ? void (0) : res.redirect(home);
/**
 * Query parser
 */
const queryParser = (req) => 
// Query
// @ts-ignore
req.query = Object.fromEntries(new URLSearchParams(req.url.split("?")[1]).entries());
export default {
    queryParser,
    bodyParser,
    renderHTML,
    serveStatic
};
