import qs from "query-string";
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
    req.on('end', () => res(qs.parse(body)));
});
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
};
