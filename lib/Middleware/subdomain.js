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
/**
 * Handle a subdomain
 */
class SubDomain {
    /**
     * @param domain the subdomain to handle
     */
    constructor(domain = ".") {
        this.domain = domain === "." ? "" : domain;
        this.mds = [];
    }
    /**
     * Register a middleware
     * @param m the middleware
     * @returns this middleware for chaining
     */
    middleware(m) {
        if (m instanceof SubDomain)
            m.domain = m.domain + (m.domain.endsWith(".") ? "" : ".") + this.domain;
        this.mds.push(m);
        return this;
    }
    /**
     * Invoke this subdomain handler
     * @param ctx
     * @param next
     */
    invoke(ctx, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const __next = (index, max) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                if (index < max) {
                    // When response ended
                    if (ctx.responseEnded)
                        // End the function
                        return;
                    // When not invoke the middleware
                    yield ((_b = this.mds[index + 1]) === null || _b === void 0 ? void 0 : _b.invoke(ctx, () => __awaiter(this, void 0, void 0, function* () { return __next(index + 1, max); })));
                }
            });
            if (ctx.subhost === this.domain)
                // Invoke the middleware
                yield ((_a = this.mds[0]) === null || _a === void 0 ? void 0 : _a.invoke(ctx, () => __awaiter(this, void 0, void 0, function* () { return __next(0, this.mds.length); })));
            // End the function
            yield next();
        });
    }
}
exports.default = SubDomain;
