// @ts-check
import * as fs from "fs";
import path from "path";

const getWrapper = (/** @type {any} */ obj) => {
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
}

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
        if (!current) return false;
    }
    return true;
}
/**
 * @param {object} obj 
 */
const getSchemFrom = obj => {
    let schem = {};
    for (let i in obj)
        schem[i] = (
            getWrapper(obj[i]) !== Object
                ? getWrapper
                : getSchemFrom
        )(obj[i]);
    return schem;
}

/**
 * @typedef {({ new (obj: object): { save: () => Promise<object>; del: () => Promise<object>;}, read: () => Promise<any[]>, match: (obj: object) => boolean, schem: string, find: (obj?: object, except?: boolean) => Promise<any[]>, findOne: (obj?: object, except?: boolean) => Promise<any>, clear: () => Promise<void>, deleteMatch: (obj?: object, except?: boolean) => Promise<void> })} Schema
 */

export default class JsonDB {
    /**
     * @type {object}
     */
    #data;
    /**
     * @type {{ name: string, schem: Schema }[]}
     */
    #schemas;
    /**
     * @type {string}
     */
    #filePath;
    /**
     * @param {string[]} filePaths
     */
    constructor(...filePaths) {
        const filePath = path.join(...filePaths);
        if (!fs.existsSync(filePath))
            fs.appendFileSync(filePath, "{}");
        this.#filePath = filePath;
        this.#schemas = [];
        this.#data = JSON.parse(
            fs.readFileSync(filePath).toString()
        );
        this.#data = this.#loadSchemas(JSON.parse(
            fs.readFileSync(filePath).toString()
        )); // Weird thing happens here so I need to fix by using the next line
        fs.writeFileSync(filePath, JSON.stringify(this.#data, null, 4));
    }
    /**
     * @param {{ [name: string]: object[] }} data
     */
    #loadSchemas = data => {
        const dt = data;
        for (let schemName in data)
            if (data[schemName][0])
                this.schema(
                    schemName,
                    getSchemFrom(data[schemName][0])
                );
        return dt;
    }
    /**
     * @type {string}
     */
    get filePath() {
        return this.#filePath;
    }
    /**
     * @param {object} schem 
     * @param {string} name
     */
    schema = (name, schem = undefined) => {
        if (!schem)
            return this.#schemas.filter(val => val.name === name)[0].schem;
        const pth = this.filePath;
        if (this.#schemas.map((/** @type {{ name: any; }} */ val) => val.name).includes(name))
            throw new Error("Invalid schema name");
        const pointer = this;
        this.#data[name] = [];
        fs.writeFileSync(pth, JSON.stringify(this.#data, null, 4));
        // End read and write file
        let sch = class Schema {
            /**
             * @type {object}
             */
            #obj;
            /**
             * @param {object} obj 
             */
            constructor(obj) {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                for (const e in obj) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                this.#obj = obj;
            }
            /**
             * @returns {Promise<object>} the object after saving
             */
            save = async () => {
                pointer.#data[Schema.schem].push(this.#obj);
                await fs.promises.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                return pointer.#data;
            }
            /**
             * @returns {Promise<object>} data before deleting
             */
            del = async () => {
                pointer.#data.splice(pointer.#data.indexOf(this.#obj), 1);
                await fs.promises.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                return pointer.#data;
            }
            /**
             * @returns {Promise<any[]>}
             */
            static read = async () =>
                pointer.#data[Schema.schem]
            /**
             * @param {object} obj 
             */
            static match = obj => {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        return false;
                }
                return true;
            }
            /**
             * @returns {string} this schema name
             */
            static get schem() {
                return name;
            }
            /**
             * @param {object} obj 
             * @param {boolean} except
             */
            static find = async (obj = undefined, except = false) =>
                await pointer.#find(Schema.schem, obj, except);
            /**
             * @param {object} obj 
             * @param {boolean} except
             */
            static findOne = async (obj = undefined, except = false) =>
                await pointer.#findOne(Schema.schem, obj, except);
            /**
             * @returns {Promise<void>}
             */
            static clear = async () => {
                pointer.#data[Schema.schem] = {};
                await fs.promises.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
            }
            /**
             * @param {object} obj 
             * @param {boolean} except
             */
            static deleteMatch = async (obj = undefined, except = false) => {
                let schem = pointer.#data[Schema.schem];
                if (obj)
                    for (let i in obj)
                        schem = schem.filter(
                            (/** @type {{ [x: string]: any; }} */ val) =>
                                (val[i] !== obj[i]) !== except
                        );
                else
                    schem = [];
                pointer.#data[Schema.schem] = schem;
                await fs.promises.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
            }
        }
        pointer.#schemas.push({
            name: name,
            schem: sch
        });
        return sch;
    }
    /**
     * @param {object} obj 
     * @param {string} schem
     * @param {boolean} except
     */
    #find = async (schem, obj = undefined, except = false) => {
        if (!this.#schemas.map((/** @type {{ name: any; }} */ val) => val.name).includes(schem))
            throw new Error("Invalid schema");
        const result = [];
        if (obj)
            for (let i in obj)
                result.push(...this.#data[schem].filter(
                    (/** @type {{ [x: string]: any; }} */ val) =>
                        (val[i] === obj[i]) !== except)
                );
        else
            result.push(...this.#data[schem]);
        return result;
    }
    /**
     * @param {object} obj 
     * @param {string} schem
     * @param {boolean} except
     */
    #findOne = async (schem, obj = undefined, except = false) => {
        if (!this.#schemas.map((/** @type {{ name: any; }} */ val) => val.name).includes(schem))
            throw new Error("Invalid schema");
        for (let e of this.#data[schem]) {
            if (obj)
                for (let i in obj)
                    if (
                        (e[i] === obj[i]) !== except
                    ) return e;
                    else if (e)
                        return e;
        }
        return {};
    }
    /**
     * @returns {Promise<void>} 
     */
    clear = async () =>
        await fs.promises.writeFile(this.filePath, "{}");
    /**
     * @param {Schema} schema
     */
    drop = async schema => {
        // @ts-ignore
        const { [schema.schem]: _, ...rest } = this.#data;
        this.#data = rest;
        this.#schemas = this.#schemas.filter(val => val.name !== schema.schem);
        await fs.promises.writeFile(this.filePath, JSON.stringify(this.#data, null, 4));
    }
}
