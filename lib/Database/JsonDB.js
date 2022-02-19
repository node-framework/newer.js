"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const events_1 = __importDefault(require("events"));
const TypeChecker_1 = require("../Utils/TypeChecker");
const ObjectMatch_1 = __importDefault(require("../Utils/ObjectMatch"));
/**
 * Promise version of FS
 */
const pfs = fs.promises;
/**
 * @param obj input object to load schema from
 * @returns the loaded schema
 */
const getSchemFrom = (obj) => {
    let schem = {};
    for (let i in obj)
        schem[i] = ((0, TypeChecker_1.getWrapper)(obj[i]) !== Object
            ? TypeChecker_1.getWrapper
            : getSchemFrom)(obj[i]);
    return schem;
};
class JsonDB {
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
            for (let schemName in data)
                if (data[schemName][0]) {
                    let schem = getSchemFrom(data[schemName][0]);
                    if (schem !== {})
                        this.schema(schemName, schem);
                }
            return data;
        };
        /**
         * @param name Schema name
         * @param schem Schema model
         * @returns the created schema
         */
        this.schema = (name, schem) => {
            var _a, _b;
            var _c;
            // Find the schema
            if (!schem)
                return (_b = (_a = this.schemas.filter(val => (val === null || val === void 0 ? void 0 : val.name) === name)[0]) === null || _a === void 0 ? void 0 : _a.schem) !== null && _b !== void 0 ? _b : undefined;
            // This database file path
            const pth = this.filePath;
            // Check whether schema exists
            if (this.schemas.map((val) => val.name).includes(name))
                return this.schemas.filter(val => val.name === name)[0].schem;
            // Reference to this object
            const pointer = this;
            // Initialize the schema docs array with an empty one
            this.data[name] = [];
            // Create a type checker
            const SchemaObject = (0, TypeChecker_1.typeChecker)(schem);
            // Write the created array to database file
            fs.writeFileSync(pth, JSON.stringify(this.data));
            // Create a class to use to manipulate the schema
            let sch = (_c = class Schema {
                    /**
                     * @param obj to manipulate
                     */
                    constructor(obj) {
                        /**
                         * @returns the object after saving it to the database
                         */
                        this.save = () => __awaiter(this, void 0, void 0, function* () {
                            pointer.data[Schema.schem].push(this.obj);
                            yield pfs.writeFile(pth, JSON.stringify(pointer.data));
                            pointer.events.emit("save-item", this.obj);
                            return pointer.data;
                        });
                        /**
                         * @returns the data after deleting
                         */
                        this.del = () => __awaiter(this, void 0, void 0, function* () {
                            let ref = pointer.data[Schema.schem];
                            ref.splice(ref.indexOf(this.obj), 1);
                            yield pfs.writeFile(pth, JSON.stringify(pointer.data));
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
                                if (!(0, TypeChecker_1.checkType)(schem[e], obj[e]))
                                    throw new Error("Invalid object");
                            }
                            for (const e in obj) {
                                if (!(0, TypeChecker_1.checkType)(schem[e], obj[e]))
                                    throw new Error("Invalid object");
                            }
                            // Assign it to current object position
                            pointer.data[Schema.schem][pointer.data[Schema.schem]
                                .indexOf(this.obj)] = obj;
                            yield pfs.writeFile(pth, JSON.stringify(pointer.data));
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
                _c.read = () => pointer.data[_c.schem],
                /**
                 * @param obj to create
                 * @returns created schema docs
                 */
                _c.create = (...obj) => obj.map(e => new _c(e)),
                /**
                 * @param obj to update
                 * @param updateObj after update
                 */
                _c.update = (obj, updateObj) => __awaiter(_c, void 0, void 0, function* () {
                    const index = pointer.data[_c.schem].indexOf(obj);
                    if (!index)
                        throw new Error("Invalid object");
                    pointer.data[_c.schem][index] = updateObj;
                    yield pfs.writeFile(pth, JSON.stringify(pointer.data));
                    pointer.events.emit("update-item", updateObj);
                    return updateObj;
                }),
                /**
                 * @param obj
                 * @returns true if object matches current schema
                 */
                _c.match = (obj) => {
                    for (const e in schem) {
                        if (!(0, TypeChecker_1.checkType)(schem[e], obj[e]))
                            return false;
                    }
                    return true;
                },
                /**
                 * @param obj to find
                 * @param except if true will find objects that don't match `obj`
                 * @param count objects to be returned
                 * @returns the result
                 */
                _c.find = (obj, count, except) => __awaiter(_c, void 0, void 0, function* () {
                    let listMatch = [];
                    for (let doc of JSON.parse((yield pfs.readFile(pth)).toString(), pointer.reviver)[_c.schem]) {
                        // Check if object matches
                        if ((0, ObjectMatch_1.default)(obj !== null && obj !== void 0 ? obj : {}, doc) === (!except)) {
                            // Check whether count != 0
                            if (count === 0)
                                break;
                            // Check whether count > 0 then minus count by 1
                            if (count && count > 0)
                                count--;
                            // Add element to list
                            listMatch.push(doc);
                        }
                    }
                    return listMatch.length === 1 ? listMatch[0] : listMatch;
                }),
                /**
                 * Clear the schema
                 */
                _c.clear = () => __awaiter(_c, void 0, void 0, function* () {
                    pointer.data[_c.schem] = [];
                    yield pfs.writeFile(pth, JSON.stringify(pointer.data));
                    pointer.events.emit("clear-schema");
                }),
                /**
                 * @param obj to delete
                 * @param except if true will delete objects that don't match `obj`
                 */
                _c.deleteMatch = (obj, except = false) => __awaiter(_c, void 0, void 0, function* () {
                    let schem = pointer.data[_c.schem];
                    if (obj)
                        for (let i in obj)
                            schem = schem.filter((val) => (val[i] !== obj[i]) !== except);
                    else
                        schem = [];
                    pointer.data[_c.schem] = schem;
                    pointer.events.emit("delete-item");
                    yield pfs.writeFile(pth, JSON.stringify(pointer.data));
                }),
                /**
                 * Drop the schema and all schema docs
                 */
                _c.drop = () => __awaiter(_c, void 0, void 0, function* () { return yield pointer.drop(_c); }),
                _c);
            pointer.schemas.push({
                name: name,
                schem: sch
            });
            return sch;
        };
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
                // Emit event
                this.events.emit("drop-database");
            }
            else {
                let schemName = typeof schema === 'function'
                    ? schema.schem
                    : schema;
                const _a = this.data, _b = schemName, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                this.data = rest;
                // Filter the schema out of the data
                this.schemas = this.schemas.filter(val => val.name !== schemName);
                // Override the current data
                yield pfs.writeFile(this.filePath, JSON.stringify(this.data));
                // Emit event
                this.events.emit('drop-schema');
            }
        });
        // create new event emitter
        this.events = new events_1.default();
        // set file path
        this.filePath = filePath;
        // List of schemas
        this.schemas = [];
        // Reviver
        this.reviver = reviver;
        const readerData = fs.readFileSync(filePath).toString();
        // Check whether file path exists
        if (!fs.existsSync(filePath))
            fs.appendFileSync(filePath, "{}");
        // Check whether file path exists then if not return this object
        if (!fs.existsSync(filePath) || (readerData === "{}")) {
            this.data = {};
            return this;
        }
        // Set data
        this.data = JSON.parse(readerData, reviver);
        // Set data after load the schema
        this.data = this.loadSchemas(JSON.parse(readerData, reviver));
        // Weird thing happens here so I need to fix by using the next line
        fs.writeFileSync(filePath, JSON.stringify(this.data));
    }
}
exports.default = JsonDB;
