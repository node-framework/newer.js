var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import qs from "query-string";
/**
* @param {import("http").IncomingMessage} req
*/
const bodyParser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Body
    // @ts-ignore
    return req.body = yield new Promise((res, rej) => {
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
