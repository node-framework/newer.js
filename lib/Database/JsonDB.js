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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const events_1 = __importDefault(require("events"));
const TypeChecker_js_1 = require("../Utils/TypeChecker.js");
const ObjectMatch_js_1 = __importDefault(require("../Utils/ObjectMatch.js"));
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
        schem[i] = ((0, TypeChecker_js_1.getWrapper)(obj[i]) !== Object
            ? TypeChecker_js_1.getWrapper
            : getSchemFrom)(obj[i]);
    return schem;
};
class JsonDB {
    events;
    /**
     * Database data
     */
    data;
    /**
     * Database schemas
     */
    schemas;
    /**
     * Database path
     */
    filePath;
    /**
     * Reviver
     */
    reviver;
    /**
     * @param filePath file path
     * @param reviver to restore objects from a string that is parsed using JSON.parse
     * @constructor
     */
    constructor(filePath, reviver) {
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
    /**
     * @param event to handle
     * @param listener to handle event
     */
    on = (event, listener) => void this.events.on(event, listener);
    /**
     * @param data loaded data
     * @returns current data after loading all the schemas
     */
    loadSchemas = (data) => {
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
    schema = (name, schem) => {
        // Find the schema
        if (!schem)
            return this.schemas.filter(val => val?.name === name)[0]?.schem ?? undefined;
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
        const SchemaObject = (0, TypeChecker_js_1.typeChecker)(schem);
        // Write the created array to database file
        fs.writeFileSync(pth, JSON.stringify(this.data));
        // Create a class to use to manipulate the schema
        let sch = class Schema {
            /**
             * Current object
             */
            obj;
            /**
             * @param obj to manipulate
             */
            constructor(obj) {
                this.obj = new SchemaObject(obj);
            }
            /**
             * @returns the object after saving it to the database
             */
            save = async () => {
                pointer.data[Schema.schem].push(this.obj);
                await pfs.writeFile(pth, JSON.stringify(pointer.data));
                pointer.events.emit("save-item", this.obj);
                return pointer.data;
            };
            /**
             * @returns the data after deleting
             */
            del = async () => {
                let ref = pointer.data[Schema.schem];
                ref.splice(ref.indexOf(this.obj), 1);
                await pfs.writeFile(pth, JSON.stringify(pointer.data));
                pointer.events.emit("delete-item");
                this.obj = undefined;
                return pointer.data;
            };
            /**
             * @param obj
             * @returns the object after updating
             */
            update = async (obj) => {
                // Check whether obj matches given schema
                for (const e in schem) {
                    if (!(0, TypeChecker_js_1.checkType)(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                for (const e in obj) {
                    if (!(0, TypeChecker_js_1.checkType)(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                // Assign it to current object position
                pointer.data[Schema.schem][pointer.data[Schema.schem]
                    .indexOf(this.obj)] = obj;
                await pfs.writeFile(pth, JSON.stringify(pointer.data));
                this.obj = obj;
                pointer.events.emit("update-item", this.obj);
                return obj;
            };
            /**
             * @returns all docs of the schema
             */
            static read = () => pointer.data[Schema.schem];
            /**
             * @param obj to create
             * @returns created schema docs
             */
            static create = (...obj) => obj.map(e => new Schema(e));
            /**
             * @param obj to update
             * @param updateObj after update
             */
            static update = async (obj, updateObj) => {
                const index = pointer.data[Schema.schem].indexOf(obj);
                if (!index)
                    throw new Error("Invalid object");
                pointer.data[Schema.schem][index] = updateObj;
                await pfs.writeFile(pth, JSON.stringify(pointer.data));
                pointer.events.emit("update-item", updateObj);
                return updateObj;
            };
            /**
             * @param obj
             * @returns true if object matches current schema
             */
            static match = (obj) => {
                for (const e in schem) {
                    if (!(0, TypeChecker_js_1.checkType)(schem[e], obj[e]))
                        return false;
                }
                return true;
            };
            /**
             * @returns {string} this schema name
             */
            static get schem() {
                return name;
            }
            /**
             * @param obj to find
             * @param except if true will find objects that don't match `obj`
             * @param count objects to be returned
             * @returns the result
             */
            static find = async (obj, count, except) => {
                let listMatch = [];
                for (let doc of JSON.parse((await pfs.readFile(pth)).toString(), pointer.reviver)[Schema.schem]) {
                    // Check if object matches
                    if ((0, ObjectMatch_js_1.default)(obj ?? {}, doc) === (!except)) {
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
                return listMatch.length <= 1 ? listMatch[0] : listMatch;
            };
            /**
             * Clear the schema
             */
            static clear = async () => {
                pointer.data[Schema.schem] = [];
                await pfs.writeFile(pth, JSON.stringify(pointer.data));
                pointer.events.emit("clear-schema");
            };
            /**
             * @param obj to delete
             * @param except if true will delete objects that don't match `obj`
             */
            static deleteMatch = async (obj, except = false) => {
                let schem = pointer.data[Schema.schem];
                if (obj)
                    for (let i in obj)
                        schem = schem.filter((val) => (val[i] !== obj[i]) !== except);
                else
                    schem = [];
                pointer.data[Schema.schem] = schem;
                pointer.events.emit("delete-item");
                await pfs.writeFile(pth, JSON.stringify(pointer.data));
            };
            /**
             * Drop the schema and all schema docs
             */
            static drop = async () => await pointer.drop(Schema);
        };
        pointer.schemas.push({
            name: name,
            schem: sch
        });
        return sch;
    };
    /**
     * @returns a promise after clearing the database
     */
    clear = async () => (this.data = {},
        await pfs.writeFile(this.filePath, "{}"),
        void this.events.emit("clear-database"));
    /**
     * @param schema setting it to a falsy value (such as undefined) will delete the whole database (which makes this object unusable)
     */
    drop = async (schema) => {
        if (!schema) {
            await pfs.unlink(this.filePath);
            this.data = undefined;
            // Emit event
            this.events.emit("drop-database");
        }
        else {
            let schemName = typeof schema === 'function'
                ? schema.schem
                : schema;
            const { [schemName]: _, ...rest } = this.data;
            this.data = rest;
            // Filter the schema out of the data
            this.schemas = this.schemas.filter(val => val.name !== schemName);
            // Override the current data
            await pfs.writeFile(this.filePath, JSON.stringify(this.data));
            // Emit event
            this.events.emit('drop-schema');
        }
    };
}
exports.default = JsonDB;
