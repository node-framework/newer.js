var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as fs from "fs";
import EventEmitter from "events";
const pfs = fs.promises;
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
    let Wrapper = getWrapper(obj);
    if (typeof type === 'function')
        return (Wrapper === type);
    for (let e in type) {
        if (!checkType(type[e], obj[e]))
            return false;
    }
    return true;
};
/**
 * @param schema generate a class to check type from
 * @returns a class to check type
 */
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
     * @param filePath file path
     * @param reviver to restore objects from a string that is parsed using JSON.parse
     * @constructor
     */
    constructor(filePath, reviver) {
        /**
         * @param event to handle
         * @param listener to handle event
         */
        this.on = (event, listener) => void this.events.on(event, listener);
        /**
         * @param data loaded data
         * @returns current data after loading all the schemas
         */
        this.loadSchemas = (data) => {
            const dt = data;
            for (let schemName in data)
                if (data[schemName][0])
                    this.schema(schemName, getSchemFrom(data[schemName][0]));
            return dt;
        };
        /**
         * @param name Schema name
         * @param schem Schema model
         * @returns the created schema
         */
        this.schema = (name, schem) => {
            var _a;
            if (!schem)
                return this.schemas.filter(val => val.name === name)[0].schem;
            // This database file path
            const pth = this.filePath;
            // Check whether schema exists
            if (this.schemas.map((val) => val.name).includes(name))
                throw new Error("Invalid schema name");
            // Reference to this object
            const pointer = this;
            // Initialize the schema docs array with an empty one
            this.data[name] = [];
            // Create a type checker
            const SchemaObject = typeChecker(schem);
            // Write the created array to database file
            fs.writeFileSync(pth, JSON.stringify(this.data, null, 4));
            // Create a class to use to manipulate the schema
            let sch = (_a = class Schema {
                    /**
                     * @param obj to manipulate
                     */
                    constructor(obj) {
                        /**
                         * @returns the object after saving it to the database
                         */
                        this.save = () => __awaiter(this, void 0, void 0, function* () {
                            pointer.data[Schema.schem].push(this.obj);
                            yield pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                            pointer.events.emit("save-item", this.obj);
                            return pointer.data;
                        });
                        /**
                         * @returns the data after deleting
                         */
                        this.del = () => __awaiter(this, void 0, void 0, function* () {
                            let ref = pointer.data[Schema.schem];
                            ref.splice(ref.indexOf(this.obj), 1);
                            yield pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                            pointer.events.emit("delete-item");
                            this.obj = undefined;
                            return pointer.data;
                        });
                        /**
                         * @param obj
                         * @returns the object after updating
                         */
                        this.update = (obj) => __awaiter(this, void 0, void 0, function* () {
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
                            pointer.data[Schema.schem][pointer.data[Schema.schem]
                                .indexOf(this.obj)] = obj;
                            yield pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                            this.obj = obj;
                            pointer.events.emit("update-item", this.obj);
                            return obj;
                        });
                        this.obj = new SchemaObject(obj);
                    }
                    /**
                     * @returns {string} this schema name
                     */
                    static get schem() {
                        return name;
                    }
                },
                /**
                 * @returns all docs of the schema
                 */
                _a.read = () => __awaiter(_a, void 0, void 0, function* () { return pointer.data[_a.schem]; }),
                /**
                 * @param obj to create
                 * @returns created schema docs
                 */
                _a.create = (...obj) => obj.map(e => new _a(e)),
                /**
                 * @param obj to update
                 * @param updateObj after update
                 */
                _a.update = (obj, updateObj) => __awaiter(_a, void 0, void 0, function* () {
                    const index = pointer.data[_a.schem].indexOf(obj);
                    if (!index)
                        throw new Error("Invalid object");
                    pointer.data[_a.schem][index] = updateObj;
                    yield pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                    pointer.events.emit("update-item", updateObj);
                    return updateObj;
                }),
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
                _a.find = (obj, except = false) => __awaiter(_a, void 0, void 0, function* () { return yield pointer.find(_a.schem, obj, except); }),
                /**
                 * @param obj to find
                 * @param except if true will find the first object that doesn't match `obj`
                 * @returns the result
                 */
                _a.findOne = (obj, except = false) => __awaiter(_a, void 0, void 0, function* () { return yield pointer.findOne(_a.schem, obj, except); }),
                /**
                 * Clear the schema
                 */
                _a.clear = () => __awaiter(_a, void 0, void 0, function* () {
                    pointer.data[_a.schem] = [];
                    yield pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                    pointer.events.emit("clear-schema");
                }),
                /**
                 * @param obj to delete
                 * @param except if true will delete objects that don't match `obj`
                 */
                _a.deleteMatch = (obj, except = false) => __awaiter(_a, void 0, void 0, function* () {
                    let schem = pointer.data[_a.schem];
                    if (obj)
                        for (let i in obj)
                            schem = schem.filter((val) => (val[i] !== obj[i]) !== except);
                    else
                        schem = [];
                    pointer.data[_a.schem] = schem;
                    pointer.events.emit("delete-item");
                    yield pfs.writeFile(pth, JSON.stringify(pointer.data, null, 4));
                }),
                _a);
            pointer.schemas.push({
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
        this.find = (schem, obj, except = false) => __awaiter(this, void 0, void 0, function* () {
            if (!this.schemas.map((val) => val.name).includes(schem))
                throw new Error("Invalid schema");
            const result = [];
            if (obj)
                for (let i in obj)
                    result.push(...this.data[schem].filter((val) => (val[i] === obj[i]) !== except));
            else
                result.push(...this.data[schem]);
            return result;
        });
        /**
         * @param schem a schema to find object in
         * @param obj find the first object that matches this object
         * @param except set to true will find the first object that don't match that object
         * @returns the first object that is found
         */
        this.findOne = (schem, obj, except = false) => __awaiter(this, void 0, void 0, function* () {
            if (!this.schemas.map((val) => val.name).includes(schem))
                throw new Error("Invalid schema");
            for (let e of this.data[schem]) {
                if (obj)
                    for (let i in obj)
                        if ((e[i] === obj[i]) !== except)
                            return e;
            }
            return {};
        });
        /**
         * @returns a promise after clearing the database
         */
        this.clear = () => __awaiter(this, void 0, void 0, function* () {
            return (this.data = {},
                yield pfs.writeFile(this.filePath, "{}"),
                void this.events.emit("clear-database"));
        });
        /**
         * @param schema setting it to a falsy value (such as undefined) will delete the whole database (which makes this object unusable)
         */
        this.drop = (schema) => __awaiter(this, void 0, void 0, function* () {
            if (!schema) {
                yield pfs.unlink(this.filePath);
                this.data = undefined;
                this.events.emit("drop-database");
                return;
            }
            let schemName = (typeof schema === 'function' ? schema.schem : schema);
            const _a = this.data, _b = schemName, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            this.data = rest;
            this.schemas = this.schemas.filter(val => val.name !== schemName);
            yield pfs.writeFile(this.filePath, JSON.stringify(this.data));
            this.events.emit('drop-schema');
        });
        this.events = new EventEmitter();
        this.filePath = filePath;
        this.schemas = [];
        this.reviver = reviver;
        !fs.existsSync(filePath)
            ? fs.appendFileSync(filePath, "{}")
            : void 0;
        if (!fs.existsSync(filePath) || (fs.readFileSync(filePath).toString() === "{}")) {
            this.data = {};
            return this;
        }
        this.data = JSON.parse(fs.readFileSync(filePath).toString(), reviver);
        this.data = this.loadSchemas(JSON.parse(fs.readFileSync(filePath).toString(), reviver));
        // Weird thing happens here so I need to fix by using the next line
        fs.writeFileSync(filePath, JSON.stringify(this.data, null, 4));
    }
}
