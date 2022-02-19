"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonReviver {
    constructor() {
        this.setReviverOf = (propName, converter) => this.reviver[propName] = converter;
        this.callback = () => (key, value) => {
            for (let i in this.reviver)
                if (key === i && typeof value === 'string')
                    return (this.reviver[i])(value);
            return value;
        };
        this.reviver = {};
        const reviver = (key, value) => 
        // @ts-ignore
        reviver.callback()(key, value);
        for (const key in this)
            // @ts-ignore
            reviver[key] = this[key];
        // @ts-ignore
        return reviver;
    }
}
exports.default = JsonReviver;
