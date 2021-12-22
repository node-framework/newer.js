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
const pfs = fs.promises;
const getWrapper = (obj) => {
    if (typeof obj === 'string')
        return String;
    if (typeof obj === 'number')
        return Number;
    if (typeof obj === 'boolean')
        return Boolean;
    if (typeof obj === 'object')
        return Object;
    throw new Error("Invalid type");
};
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
const typeChecker = (schema) => class {
    constructor(obj) {
        for (const e in schema) {
            if (!checkType(schema[e], obj[e]))
                throw new Error("Invalid object");
        }
        for (const e in obj) {
            if (!checkType(schema[e], obj[e]))
                throw new Error("Invalid object");
        }
        return obj;
    }
};
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
            let pointer = this;
            __classPrivateFieldGet(this, _JsonDB_data, "f")[name] = [];
            const SchemaObject = typeChecker(schem);
            fs.writeFileSync(pth, JSON.stringify(__classPrivateFieldGet(this, _JsonDB_data, "f"), null, 4));
            let sch = (_a = class Schema {
                    constructor(obj) {
                        _Schema_obj.set(this, void 0);
                        this.save = async () => {
                            Schema.docs.push(__classPrivateFieldGet(this, _Schema_obj, "f"));
                            await pfs.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            return __classPrivateFieldGet(pointer, _JsonDB_data, "f");
                        };
                        this.del = async () => {
                            let ref = Schema.docs;
                            ref.splice(ref.indexOf(__classPrivateFieldGet(this, _Schema_obj, "f")), 1);
                            __classPrivateFieldSet(this, _Schema_obj, undefined, "f");
                            await pfs.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            return __classPrivateFieldGet(pointer, _JsonDB_data, "f");
                        };
                        this.update = async (obj) => {
                            for (const e in schem) {
                                if (!checkType(schem[e], obj[e]))
                                    throw new Error("Invalid object");
                            }
                            for (const e in obj) {
                                if (!checkType(schem[e], obj[e]))
                                    throw new Error("Invalid object");
                            }
                            Schema.docs[Schema.docs
                                .indexOf(__classPrivateFieldGet(this, _Schema_obj, "f"))] = obj;
                            await pfs.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            __classPrivateFieldSet(this, _Schema_obj, obj, "f");
                            return obj;
                        };
                        __classPrivateFieldSet(this, _Schema_obj, new SchemaObject(obj), "f");
                    }
                    static get schem() {
                        return name;
                    }
                    static get docs() {
                        return __classPrivateFieldGet(pointer, _JsonDB_data, "f")[Schema.schem];
                    }
                },
                _Schema_obj = new WeakMap(),
                _a.read = async () => __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem],
                _a.create = (...obj) => obj.map(e => new _a(e)),
                _a.update = async (obj, updateObj) => {
                    const index = _a.docs.indexOf(obj);
                    if (!index)
                        throw new Error("Invalid object");
                    _a.docs[index] = updateObj;
                    await pfs.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                    return updateObj;
                },
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
                    __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem] = [];
                    await pfs.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                },
                _a.deleteMatch = async (obj = undefined, except = false) => {
                    let schem = _a.docs;
                    if (obj)
                        for (let i in obj)
                            schem = schem.filter((val) => (val[i] !== obj[i]) !== except);
                    else
                        schem = [];
                    __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem] = schem;
                    await pfs.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                },
                _a);
            __classPrivateFieldGet(pointer, _JsonDB_schemas, "f").push({
                name: name,
                schem: sch
            });
            return sch;
        };
        _JsonDB_find.set(this, async (schem, obj = undefined, except = false) => {
            if (!__classPrivateFieldGet(this, _JsonDB_schemas, "f").map((val) => val.name).includes(schem))
                throw new Error("Invalid schema");
            const result = [];
            if (obj)
                for (let i in obj)
                    result.push(...__classPrivateFieldGet(this, _JsonDB_data, "f")[schem].filter((val) => (val[i] === obj[i]) !== except));
            else
                result.push(...__classPrivateFieldGet(this, _JsonDB_data, "f")[schem]);
            return result;
        });
        _JsonDB_findOne.set(this, async (schem, obj = undefined, except = false) => {
            if (!__classPrivateFieldGet(this, _JsonDB_schemas, "f").map((val) => val.name).includes(schem))
                throw new Error("Invalid schema");
            for (let e of __classPrivateFieldGet(this, _JsonDB_data, "f")[schem]) {
                if (obj)
                    for (let i in obj)
                        if ((e[i] === obj[i]) !== except)
                            return e;
            }
            return {};
        });
        this.clear = async () => (__classPrivateFieldSet(this, _JsonDB_data, {}, "f"),
            await pfs.writeFile(this.filePath, "{}"));
        this.drop = async (schema = undefined) => {
            if (!schema) {
                await pfs.unlink(__classPrivateFieldGet(this, _JsonDB_filePath, "f"));
                __classPrivateFieldSet(this, _JsonDB_data, undefined, "f");
                return;
            }
            let schemName = (typeof schema === 'function' ? schema.schem : schema);
            const { [schemName]: _, ...rest } = __classPrivateFieldGet(this, _JsonDB_data, "f");
            __classPrivateFieldSet(this, _JsonDB_data, rest, "f");
            __classPrivateFieldSet(this, _JsonDB_schemas, __classPrivateFieldGet(this, _JsonDB_schemas, "f").filter(val => val.name !== schemName), "f");
            await pfs.writeFile(this.filePath, JSON.stringify(__classPrivateFieldGet(this, _JsonDB_data, "f")));
        };
        const filePath = path.join(...filePaths);
        if (!fs.existsSync(filePath))
            fs.appendFileSync(filePath, "{}");
        __classPrivateFieldSet(this, _JsonDB_filePath, filePath, "f");
        __classPrivateFieldSet(this, _JsonDB_schemas, [], "f");
        __classPrivateFieldSet(this, _JsonDB_data, JSON.parse(fs.readFileSync(filePath).toString()), "f");
        __classPrivateFieldSet(this, _JsonDB_data, __classPrivateFieldGet(this, _JsonDB_loadSchemas, "f").call(this, JSON.parse(fs.readFileSync(filePath).toString())), "f");
        fs.writeFileSync(filePath, JSON.stringify(__classPrivateFieldGet(this, _JsonDB_data, "f"), null, 4));
    }
    get filePath() {
        return __classPrivateFieldGet(this, _JsonDB_filePath, "f");
    }
}
_JsonDB_data = new WeakMap(), _JsonDB_schemas = new WeakMap(), _JsonDB_filePath = new WeakMap(), _JsonDB_loadSchemas = new WeakMap(), _JsonDB_find = new WeakMap(), _JsonDB_findOne = new WeakMap();
