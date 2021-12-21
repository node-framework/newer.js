/// <reference types="node" />
declare const _default: {
    queryParser: (req: import("http").IncomingMessage) => {
        [k: string]: string;
    };
    bodyParser: (req: import("http").IncomingMessage) => Promise<unknown>;
    renderHTML: (_: any, res: import("http").ServerResponse, server: import("./nodeserver.js").default) => void;
};
export default _default;
//# sourceMappingURL=middlewares.d.ts.map