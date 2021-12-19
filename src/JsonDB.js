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
    return null;
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
     * @type {string[]}
     * @private
     */
    schemas;
    /**
     * @type {string}
     */
    parentPath;
    /**
     * @type {string}
     */
    fileName;
    /**
     * @param {string} fileName 
     * @param {string} parentPath 
     */
    constructor(fileName, parentPath = ".") {
        if (!existsSync(path.join(parentPath, fileName)))
            fs.appendFileSync(path.join(parentPath, fileName), "{}");
        fs.chmodSync(path.join(parentPath, fileName), 0o400);
        this.fileName = fileName;
        this.parentPath = parentPath;
        this.schemas = [];
    }
    /**
     * @param {object} schem 
     * @param {string} name
     */
    schema = (schem, name) => {
        if (this.schemas.includes(name))
            throw new Error("Invalid schema name");
        const pth = path.join(this.parentPath, this.fileName);
        const pointer = this;
        // Read and append this schema
        const current = JSON.parse(
            fs.readFileSync(pth).toString()
        );
        current[name] = [];
        // Open the file for writing
        fs.chmodSync(pth, 0o600);
        fs.writeFileSync(pth, JSON.stringify(current, null, 4));
        // Prevent user from editing
        fs.chmodSync(pth, 0o400);
        pointer.schemas.push(name);
        // End read and write file
        return class Schema {
            /**
             * @type {string}
             */
            #name;
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
                const current = JSON.parse(
                    (await fs.promises.readFile(pth)).toString()
                );
                current[Schema.schem].push(this.#obj);
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
                await fs.promises.writeFile(pth, JSON.stringify(current, null, 4));
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
                return current;
            }
            /**
             * @returns {Promise<object>} data before deleting
             */
            del = async () => {
                const current = JSON.parse(
                    (await fs.promises.readFile(pth)).toString()
                );
                current.splice(current.indexOf(this.#obj), 1);
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
                await fs.promises.writeFile(pth, JSON.stringify(current, null, 4));
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
                return current;
            }
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
                await pointer.#find(this, obj, except);
            /**
             * @param {object} obj 
             * @param {boolean} except
             */
            static findOne = async (obj = undefined, except = false) =>
                await pointer.#findOne(this, obj, except);
            /**
             * @returns {Promise<void>}
             */
            static clear = async () => {
                const current = JSON.parse(
                    (await fs.promises.readFile(pth)).toString()
                );
                current[Schema.schem] = {};
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
                await fs.promises.writeFile(pth, JSON.stringify(current, null, 4));
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
            }
            /**
             * @param {object} obj 
             * @param {number | undefined} count 
             * @param {boolean} except
             */
            static deleteMatch = async (obj, count = undefined, except = false) => {
                const current = JSON.parse(
                    (await fs.promises.readFile(pth)).toString()
                );
                // Open the file for writing
                fs.chmodSync(pth, 0o600);
                let schem = current[Schema.schem];
                // @ts-ignore
                for (let i in obj)
                    schem = schem.filter(
                        (/** @type {{ [x: string]: any; }} */ val) =>
                            (val[i] !== obj[i]) !== except
                    );
                current[Schema.schem] = schem;
                await fs.promises.writeFile(pth, JSON.stringify(current, null, 4));
                // Prevent user from editing
                fs.chmodSync(pth, 0o400);
            }
        }
    }
    /**
     * @param {object} obj 
     * @param {Function} schem
     * @param {boolean} except
     */
    #find = async (schem, obj = undefined, except = false) => {
        // @ts-ignore
        if (!this.schemas.includes(schem.schem))
            throw new Error("Invalid schema");
        const current = JSON.parse(
            (await fs.promises.readFile(path.join(this.parentPath, this.fileName))).toString()
        );
        const result = [];
        if (obj)
            for (let i in obj)
                // @ts-ignore
                result.push(...current[schem.schem].filter(
                    (/** @type {{ [x: string]: any; }} */ val) =>
                        (val[i] === obj[i]) !== except)
                );
        else
            // @ts-ignore
            result.push(...current[schem.schem]);
        return result;
    }
    /**
     * @param {object} obj 
     * @param {Function} schem
     * @param {boolean} except
     */
    #findOne = async (schem, obj = undefined, except = false) => {
        // @ts-ignore
        if (!this.schemas.includes(schem.schem))
            throw new Error("Invalid schema");
        const current = JSON.parse(
            (await fs.promises.readFile(path.join(this.parentPath, this.fileName))).toString()
        );
        // @ts-ignore
        for (let e of current[schem.schem]) {
            if (obj)
                for (let i in obj)
                    // @ts-ignore
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
        const pth = path.join(this.parentPath, this.fileName);
        // Open this file for writing
        fs.chmodSync(pth, 0o600);
        await fs.promises.writeFile(pth, "{}");
        // Prevent user from editing
        fs.chmodSync(pth, 0o400);
    }
    /**
     * @param {Function} schema
     */
    drop = async schema => {
        const pth = path.join(this.parentPath, this.fileName);
        let current = JSON.parse(
            (await fs.promises.readFile(pth)).toString()
        );
        // Open this file for writing
        fs.chmodSync(pth, 0o600);
        // @ts-ignore
        const { [schema.schem]: _, ...rest } = current;
        current = rest;
        // @ts-ignore
        this.schemas.splice(this.schemas.indexOf(schema.schem), 1);
        await fs.promises.writeFile(pth, JSON.stringify(current, null, 4));
        // Prevent user from editing
        fs.chmodSync(pth, 0o400);
    }
}
