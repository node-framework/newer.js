var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Reviver_reviverKeys;
export default class Reviver {
    constructor() {
        _Reviver_reviverKeys.set(this, void 0);
        this.register = (key, returnVal) => __classPrivateFieldGet(this, _Reviver_reviverKeys, "f").push({
            key,
            converter: returnVal
        });
        this.callback = () => (key, val) => {
            for (let keyVal of __classPrivateFieldGet(this, _Reviver_reviverKeys, "f")) {
                if (keyVal.key === key)
                    return keyVal.converter(val);
            }
            return val;
        };
        __classPrivateFieldSet(this, _Reviver_reviverKeys, [], "f");
    }
}
_Reviver_reviverKeys = new WeakMap();
