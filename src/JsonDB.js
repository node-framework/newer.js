// @ts-check
import fs, { existsSync } from "fs";
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

export default class JsonDB {
    /**
     * @type {object}
     */
    #data;
    /**
     * @type {string[]}
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
        if (!existsSync(filePath))
            fs.appendFileSync(filePath, "{}");
        fs.chmodSync(filePath, 0o400);
        this.#filePath = filePath;
        this.#schemas = [];
        this.#data = JSON.parse(
            fs.readFileSync(filePath).toString()
        );
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
    schema = (schem, name) => {
        const pth = this.filePath;
        // Open the file for writing
        fs.chmodSync(pth, 0o600);
        if (this.#schemas.includes(name))
            throw new Error("Invalid schema name");
        const pointer = this;
        this.#data[name] = [];
        fs.writeFileSync(pth, JSON.stringify(this.#data, null, 4));
        // Prevent user from editing
        fs.chmodSync(pth, 0o400);
        pointer.#schemas.push(name);
        // End read and write file
        return class Schema {
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
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
                await fs.promises.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
                return pointer.#data;
            }
            /**
             * @returns {Promise<object>} data before deleting
             */
            del = async () => {
                pointer.#data.splice(pointer.#data.indexOf(this.#obj), 1);
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
                await fs.promises.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
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
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
                await fs.promises.writeFile(pth, JSON.stringify(pointer.#data, null, 4));
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
            }
            /**
             * @param {object} obj 
             * @param {boolean} except
             */
            static deleteMatch = async (obj = undefined, except = false) => {
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
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
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
            }
        }
    }
    /**
     * @param {object} obj 
     * @param {string} schem
     * @param {boolean} except
     */
    #find = async (schem, obj = undefined, except = false) => {
        if (!this.#schemas.includes(schem))
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
        if (!this.#schemas.includes(schem))
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
    clear = async () => {
        // Open this file for writing
        fs.chmodSync(this.filePath, 0o600);
        await fs.promises.writeFile(this.filePath, "{}");
        // Prevent user from editing
        fs.chmodSync(this.filePath, 0o400);
    }
    /**
     * @param {Function} schema
     */
    drop = async schema => {
        // Open this file for writing
        fs.chmodSync(this.filePath, 0o600);
        // @ts-ignore
        const { [schema.schem]: _, ...rest } = this.#data;
        this.#data = rest;
        // @ts-ignore
        this.schemas.splice(this.schemas.indexOf(schema.schem), 1);
        await fs.promises.writeFile(this.filePath, JSON.stringify(this.#data, null, 4));
        // Prevent user from editing
        fs.chmodSync(this.filePath, 0o400);
    }
}
