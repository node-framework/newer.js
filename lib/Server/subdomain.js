"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class SubDomain {
    /**
     * @param domain the subdomain to handle
     */
    constructor(domain = ".", handler) {
        this.domain = domain === "." ? "" : domain;
        this.handler = handler;
    }
    /**
     * Invoke this subdomain handler
     * @param ctx
     * @param next
     */
    invoke(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.subhost === this.domain)
                // Invoke the handler
                yield this.handler.invoke(ctx);
            // Else, call the next middleware
            if (next)
                // End the middleware
                yield next();
        });
    }
}
exports.default = SubDomain;
