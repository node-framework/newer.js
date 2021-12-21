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
/**
 * @param obj
 * @returns the wrapper of the input object type
 */
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
 * @param obj input object to load schema from
 * @returns the loaded schema
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
    /**
     * @param filePaths file paths to join into 1 path
     * @constructor
     */
    constructor(...filePaths) {
        /**
         * Database data
         */
        _JsonDB_data.set(this, void 0);
        /**
         * Database schemas
         */
        _JsonDB_schemas.set(this, void 0);
        /**
         * Database path
         */
        _JsonDB_filePath.set(this, void 0);
        /**
         * @param data loaded data
         * @returns current data after loading all the schemas
         */
        _JsonDB_loadSchemas.set(this, (data) => {
            const dt = data;
            for (let schemName in data)
                if (data[schemName][0])
                    this.schema(schemName, getSchemFrom(data[schemName][0]));
            return dt;
        }
        /**
         * Returns the current database paths
         */
        );
        /**
         * @param name Schema name
         * @param schem Schema model
         * @returns the created schema
         */
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
                    /**
                     * @param obj to manipulate
                     */
                    constructor(obj) {
                        /**
                         * Current object
                         */
                        _Schema_obj.set(this, void 0);
                        /**
                         * @returns the object after saving it to the database
                         */
                        this.save = async () => {
                            Schema.docs.push(__classPrivateFieldGet(this, _Schema_obj, "f"));
                            await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            return __classPrivateFieldGet(pointer, _JsonDB_data, "f");
                        };
                        /**
                         * @returns the data after deleting
                         */
                        this.del = async () => {
                            let ref = Schema.docs;
                            ref.splice(ref.indexOf(__classPrivateFieldGet(this, _Schema_obj, "f")), 1);
                            __classPrivateFieldSet(this, _Schema_obj, undefined, "f");
                            await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            return __classPrivateFieldGet(pointer, _JsonDB_data, "f");
                        };
                        /**
                         * @param obj
                         * @returns the object after updating
                         */
                        this.update = async (obj) => {
                            // Check whether obj matches given schema
                            for (const e in schem) {
                                if (!checkType(schem[e], obj[e]))
                                    throw new Error("Invalid object");
                            }
                            for (const e in obj) {
                                if (!checkType(schem[e], obj[e]))
                                    throw new Error("Invalid object");
                            }
                            // Assign it to current object position
                            Schema.docs[Schema.docs
                                .indexOf(__classPrivateFieldGet(this, _Schema_obj, "f"))] = obj;
                            await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                            __classPrivateFieldSet(this, _Schema_obj, obj, "f");
                            return obj;
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
                    /**
                     * All docs
                     */
                    static get docs() {
                        return __classPrivateFieldGet(pointer, _JsonDB_data, "f")[Schema.schem];
                    }
                },
                _Schema_obj = new WeakMap(),
                /**
                 * @returns all docs of the schema
                 */
                _a.read = async () => __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem],
                /**
                 * @param obj
                 * @returns true if object matches current schema
                 */
                _a.match = (obj) => {
                    for (const e in schem) {
                        if (!checkType(schem[e], obj[e]))
                            return false;
                    }
                    return true;
                },
                /**
                 * @param obj to find
                 * @param except if true will find objects that don't match `obj`
                 * @returns the result
                 */
                _a.find = async (obj = undefined, except = false) => await __classPrivateFieldGet(pointer, _JsonDB_find, "f").call(pointer, _a.schem, obj, except),
                /**
                 * @param obj to find
                 * @param except if true will find the first object that doesn't match `obj`
                 * @returns the result
                 */
                _a.findOne = async (obj = undefined, except = false) => await __classPrivateFieldGet(pointer, _JsonDB_findOne, "f").call(pointer, _a.schem, obj, except),
                /**
                 * Clear the schema
                 */
                _a.clear = async () => {
                    __classPrivateFieldGet(pointer, _JsonDB_data, "f")[_a.schem] = [];
                    await fs.promises.writeFile(pth, JSON.stringify(__classPrivateFieldGet(pointer, _JsonDB_data, "f"), null, 4));
                },
                /**
                 * @param obj to delete
                 * @param except if true will delete objects that don't match `obj`
                 */
                _a.deleteMatch = async (obj = undefined, except = false) => {
                    let schem = _a.docs;
                    if (obj)
                        for (let i in obj)
                            schem = schem.filter((val) => (val[i] !== obj[i]) !== except);
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
        /**
         * @param schem a schema to find object in
         * @param obj find objects that matches this object
         * @param except set to true will find objects that don't match that object
         * @returns objects that is found
         */
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
        }
        /**
         * @param schem a schema to find object in
         * @param obj find the first object that matches this object
         * @param except set to true will find the first object that don't match that object
         * @returns the first object that is found
         */
        );
        /**
         * @param schem a schema to find object in
         * @param obj find the first object that matches this object
         * @param except set to true will find the first object that don't match that object
         * @returns the first object that is found
         */
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
        }
        /**
         * @returns a promise after clearing the database
         */
        );
        /**
         * @returns a promise after clearing the database
         */
        this.clear = async () => (__classPrivateFieldSet(this, _JsonDB_data, {}, "f"),
            await fs.promises.writeFile(this.filePath, "{}"));
        /**
         * @param schema setting it to a falsy value (such as undefined) will delete the whole database (which makes this object unusable)
         */
        this.drop = async (schema = undefined) => {
            if (!schema) {
                await fs.promises.unlink(__classPrivateFieldGet(this, _JsonDB_filePath, "f"));
                __classPrivateFieldSet(this, _JsonDB_data, undefined, "f");
                return;
            }
            let schemName = (typeof schema === 'function' ? schema.schem : schema);
            const { [schemName]: _, ...rest } = __classPrivateFieldGet(this, _JsonDB_data, "f");
            __classPrivateFieldSet(this, _JsonDB_data, rest, "f");
            __classPrivateFieldSet(this, _JsonDB_schemas, __classPrivateFieldGet(this, _JsonDB_schemas, "f").filter(val => val.name !== schemName), "f");
            await fs.promises.writeFile(this.filePath, JSON.stringify(__classPrivateFieldGet(this, _JsonDB_data, "f")));
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
    /**
     * Returns the current database paths
     */
    get filePath() {
        return __classPrivateFieldGet(this, _JsonDB_filePath, "f");
    }
}
_JsonDB_data = new WeakMap(), _JsonDB_schemas = new WeakMap(), _JsonDB_filePath = new WeakMap(), _JsonDB_loadSchemas = new WeakMap(), _JsonDB_find = new WeakMap(), _JsonDB_findOne = new WeakMap();
