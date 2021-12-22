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
    #data;
    #schemas;
    #filePath;
    constructor(...filePaths) {
        const filePath = path.join(...filePaths);
        if (!fs.existsSync(filePath))
            fs.appendFileSync(filePath, "{}");
        this.#filePath = filePath;
        this.#schemas = [];
        this.#data = JSON.parse(fs.readFileSync(filePath).toString());
        this.#data = this.#loadSchemas(JSON.parse(fs.readFileSync(filePath).toString()));
        fs.writeFileSync(filePath, JSON.stringify(this.#data, null, 4));
    }
    #loadSchemas = (data) => {
        const dt = data;
        for (let schemName in data)
            if (data[schemName][0])
                this.schema(schemName, getSchemFrom(data[schemName][0]));
        return dt;
    };
    get filePath() {
        return this.#filePath;
    }
    schema = (name, schem = undefined) => {
        if (!schem)
            return this.#schemas.filter(val => val.name === name)[0].schem;
        const pth = this.filePath;
        if (this.#schemas.map((val) => val.name).includes(name))
            throw new Error("Invalid schema name");
        let pointer = this;
        this.#data[name] = [];
        const SchemaObject = typeChecker(schem);
        fs.writeFileSync(pth, JSON.stringify(this.#data, null, 4));
        let sch = class Schema {
            #obj;
            constructor(obj) {
                this.#obj = new SchemaObject(obj);
            }
            save = async () => {
                Schema.docs.push(this.#obj);
                await pfs.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                return pointer.#data;
            };
            del = async () => {
                let ref = Schema.docs;
                ref.splice(ref.indexOf(this.#obj), 1);
                this.#obj = undefined;
                await pfs.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                return pointer.#data;
            };
            update = async (obj) => {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                for (const e in obj) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                Schema.docs[Schema.docs
                    .indexOf(this.#obj)] = obj;
                await pfs.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                this.#obj = obj;
                return obj;
            };
            static read = async () => pointer.#data[Schema.schem];
            static create = (...obj) => obj.map(e => new Schema(e));
            static update = async (obj, updateObj) => {
                const index = Schema.docs.indexOf(obj);
                if (!index)
                    throw new Error("Invalid object");
                Schema.docs[index] = updateObj;
                await pfs.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                return updateObj;
            };
            static match = (obj) => {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        return false;
                }
                return true;
            };
            static get schem() {
                return name;
            }
            static find = async (obj = undefined, except = false) => await pointer.#find(Schema.schem, obj, except);
            static findOne = async (obj = undefined, except = false) => await pointer.#findOne(Schema.schem, obj, except);
            static clear = async () => {
                pointer.#data[Schema.schem] = [];
                await pfs.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
            };
            static deleteMatch = async (obj = undefined, except = false) => {
                let schem = Schema.docs;
                if (obj)
                    for (let i in obj)
                        schem = schem.filter((val) => (val[i] !== obj[i]) !== except);
                else
                    schem = [];
                pointer.#data[Schema.schem] = schem;
                await pfs.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
            };
            static get docs() {
                return pointer.#data[Schema.schem];
            }
        };
        pointer.#schemas.push({
            name: name,
            schem: sch
        });
        return sch;
    };
    #find = async (schem, obj = undefined, except = false) => {
        if (!this.#schemas.map((val) => val.name).includes(schem))
            throw new Error("Invalid schema");
        const result = [];
        if (obj)
            for (let i in obj)
                result.push(...this.#data[schem].filter((val) => (val[i] === obj[i]) !== except));
        else
            result.push(...this.#data[schem]);
        return result;
    };
    #findOne = async (schem, obj = undefined, except = false) => {
        if (!this.#schemas.map((val) => val.name).includes(schem))
            throw new Error("Invalid schema");
        for (let e of this.#data[schem]) {
            if (obj)
                for (let i in obj)
                    if ((e[i] === obj[i]) !== except)
                        return e;
        }
        return {};
    };
    clear = async () => (this.#data = {},
        await pfs.writeFile(this.filePath, "{}"));
    drop = async (schema = undefined) => {
        if (!schema) {
            await pfs.unlink(this.#filePath);
            this.#data = undefined;
            return;
        }
        let schemName = (typeof schema === 'function' ? schema.schem : schema);
        const { [schemName]: _, ...rest } = this.#data;
        this.#data = rest;
        this.#schemas = this.#schemas.filter(val => val.name !== schemName);
        await pfs.writeFile(this.filePath, JSON.stringify(this.#data));
    };
}
