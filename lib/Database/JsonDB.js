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
var _JsonDB_data, _JsonDB_schemas, _JsonDB_filePath, _JsonDB_loadSchemas, _JsonDB_find, _JsonDB_findOne;
import * as fs from "fs";
import path from "path";
const getWrapper = (obj) => {
    if (typeof obj === 'string')
        return String;
    if (typeof obj === 'number')
        return Number;
    if (typeof obj === 'bigint')
        return BigInt;
    if (typeof obj === 'boolean')
        return Boolean;
    if (typeof obj === 'symbol')
        return Symbol;
    if (typeof obj === 'object')
        return Object;
    if (typeof obj === 'function')
        return Function;
    return typeof obj;
};
/**
 * @param {any | object} type
 * @param {any | object} obj
 */
const checkType = (type, obj) => {
    if (typeof type === 'function')
        return getWrapper(obj) === type;
    let current = true;
    for (let e in type) {
        current = checkType(type[e], obj[e]);
        if (!current)
            return false;
    }
    return true;
};
/**
 * @param {object} obj
 */
const getSchemFrom = (obj) => {
    let schem = {};
    for (let i in obj)
        schem[i] = (getWrapper(obj[i]) !== Object
            ? getWrapper
            : getSchemFrom)(obj[i]);
    return schem;
};
export default class JsonDB {
    constructor(...filePaths) {
        _JsonDB_data.set(this, void 0);
        _JsonDB_schemas.set(this, void 0);
        _JsonDB_filePath.set(this, void 0);
        _JsonDB_loadSchemas.set(this, (data) => {
            const dt = data;
            for (let schemName in data)
                if (data[schemName][0])
                    this.schema(schemName, getSchemFrom(data[schemName][0]));
            return dt;
        });
        this.schema = (name, schem = undefined) => {
            var _a, _Schema_obj;
            if (!schem)
                return __classPrivateFieldGet(this, _JsonDB_schemas, "f").filter(val => val.name === name)[0].schem;
            const pth = this.filePath;
            if (__classPrivateFieldGet(this, _JsonDB_schemas, "f").map((val) => val.name).includes(name))
                throw new Error("Invalid schema name");
            const pointer = this;
            __classPrivateFieldGet(this, _JsonDB_data, "f")[name] = [];
            fs.writeFileSync(pth, JSON.stringify(__classPrivateFieldGet(this, _JsonDB_data, "f"), null, 4));
            // End read and write file
            let sch = (_a = class Schema {
                    constructor(obj) {
                        _Schema_obj.set(this, void 0);
                        this.save = async () => {
                            __classPrivateFieldGet(pointer, _JsonDB_data, "f")[Schema.schem].push(__classPrivateFieldGet(this, _Schema_obj, "f"));
                            await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            return __classPrivateFieldGet(pointer, _JsonDB_data, "f");
                        };
                        this.del = async () => {
                            let ref = __classPrivateFieldGet(pointer, _JsonDB_data, "f")[Schema.schem];
                            ref.splice(ref.indexOf(__classPrivateFieldGet(this, _Schema_obj, "f")), 1);
                            await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            return __classPrivateFieldGet(pointer, _JsonDB_data, "f");
                        };
                        for (const e in schem) {
                            if (!checkType(schem[e], obj[e]))
                                throw new Error("Invalid object");
                        }
                        for (const e in obj) {
                            if (!checkType(schem[e], obj[e]))
                                throw new Error("Invalid object");
                        }
                        __classPrivateFieldSet(this, _Schema_obj, obj, "f");
                    }
                    /**
                     * @returns {string} this schema name
                     */
                    static get schem() {
                        return name;
                    }
                },
                _Schema_obj = new WeakMap(),
                _a.read = async () => __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem],
                _a.match = (obj) => {
                    for (const e in schem) {
                        if (!checkType(schem[e], obj[e]))
                            return false;
                    }
                    return true;
                },
                _a.find = async (obj = undefined, except = false) => await __classPrivateFieldGet(pointer, _JsonDB_find, "f").call(pointer, _a.schem, obj, except),
                _a.findOne = async (obj = undefined, except = false) => await __classPrivateFieldGet(pointer, _JsonDB_findOne, "f").call(pointer, _a.schem, obj, except),
                _a.clear = async () => {
                    __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem] = {};
                    await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                },
                /**
                 * @param {object} obj
                 * @param {boolean} except
                 */
                _a.deleteMatch = async (obj = undefined, except = false) => {
                    let schem = __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem];
                    if (obj)
                        for (let i in obj)
                            schem = schem.filter((/** @type {{ [x: string]: any; }} */ val) => (val[i] !== obj[i]) !== except);
                    else
                        schem = [];
                    __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem] = schem;
                    await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                },
                _a);
            __classPrivateFieldGet(pointer, _JsonDB_schemas, "f").push({
                name: name,
                schem: sch
            });
            return sch;
        };
        _JsonDB_find.set(this, async (schem, obj = undefined, except = false) => {
            if (!__classPrivateFieldGet(this, _JsonDB_schemas, "f").map((/** @type {{ name: any; }} */ val) => val.name).includes(schem))
                throw new Error("Invalid schema");
            const result = [];
            if (obj)
                for (let i in obj)
                    result.push(...__classPrivateFieldGet(this, _JsonDB_data, "f")[schem].filter((/** @type {{ [x: string]: any; }} */ val) => (val[i] === obj[i]) !== except));
            else
                result.push(...__classPrivateFieldGet(this, _JsonDB_data, "f")[schem]);
            return result;
        });
        _JsonDB_findOne.set(this, async (schem, obj = undefined, except = false) => {
            if (!__classPrivateFieldGet(this, _JsonDB_schemas, "f").map((/** @type {{ name: any; }} */ val) => val.name).includes(schem))
                throw new Error("Invalid schema");
            for (let e of __classPrivateFieldGet(this, _JsonDB_data, "f")[schem]) {
                if (obj)
                    for (let i in obj)
                        if ((e[i] === obj[i]) !== except)
                            return e;
                        else if (e)
                            return e;
            }
            return {};
        });
        this.clear = async () => await fs.promises.writeFile(this.filePath, "{}");
        this.drop = async (schema) => {
            // @ts-ignore
            const { [schema.schem]: _, ...rest } = __classPrivateFieldGet(this, _JsonDB_data, "f");
            __classPrivateFieldSet(this, _JsonDB_data, rest, "f");
            __classPrivateFieldSet(this, _JsonDB_schemas, __classPrivateFieldGet(this, _JsonDB_schemas, "f").filter(val => val.name !== schema.schem), "f");
            await fs.promises.writeFile(this.filePath, JSON.stringify(__classPrivateFieldGet(this, _JsonDB_data, "f"), null, 4));
        };
        const filePath = path.join(...filePaths);
        if (!fs.existsSync(filePath))
            fs.appendFileSync(filePath, "{}");
        __classPrivateFieldSet(this, _JsonDB_filePath, filePath, "f");
        __classPrivateFieldSet(this, _JsonDB_schemas, [], "f");
        __classPrivateFieldSet(this, _JsonDB_data, JSON.parse(fs.readFileSync(filePath).toString()), "f");
        __classPrivateFieldSet(this, _JsonDB_data, __classPrivateFieldGet(this, _JsonDB_loadSchemas, "f").call(this, JSON.parse(fs.readFileSync(filePath).toString())), "f"); // Weird thing happens here so I need to fix by using the next line
        fs.writeFileSync(filePath, JSON.stringify(__classPrivateFieldGet(this, _JsonDB_data, "f"), null, 4));
    }
    get filePath() {
        return __classPrivateFieldGet(this, _JsonDB_filePath, "f");
    }
}
_JsonDB_data = new WeakMap(), _JsonDB_schemas = new WeakMap(), _JsonDB_filePath = new WeakMap(), _JsonDB_loadSchemas = new WeakMap(), _JsonDB_find = new WeakMap(), _JsonDB_findOne = new WeakMap();
