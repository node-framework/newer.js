declare namespace _default {
    export { queryParser };
    export { bodyParser };
    export { renderHTML };
}
export default _default;
/**
* @param {import("http").IncomingMessage} req
*/
declare function queryParser(req: import("http").IncomingMessage): {
    [k: string]: string;
};
/**
* @param {import("http").IncomingMessage} req
*/
declare function bodyParser(req: import("http").IncomingMessage): Promise<any>;
/**
* @param {any} _
* @param {import("http").ServerResponse} res
* @param {import("./nodeserver.js")} server
*/
declare function renderHTML(_: any, res: import("http").ServerResponse, server: typeof import("./nodeserver.js")): void;
//# sourceMappingURL=middlewares.d.ts.map