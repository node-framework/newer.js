"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function match(obj1, obj2) {
    try {
        if (obj1 === obj2)
            return true;
        for (let i in obj1)
            if (!match(obj1[i], obj2[i]))
                return false;
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.default = match;
