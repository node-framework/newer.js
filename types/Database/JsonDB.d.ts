export default class JsonDB {
    /**
     * @param {string[]} filePaths
     */
    constructor(...filePaths: string[]);
    /**
     * @type {string}
     */
    get filePath(): string;
    /**
     * @param {string} name
     */
    get: (name: string) => Function;
    /**
     * @param {object} schem
     * @param {string} name
     */
    schema: (name: string, schem: object) => {
        new (obj: object): {
            /**
             * @type {object}
             */
            "__#3@#obj": object;
            /**
             * @returns {Promise<object>} the object after saving
             */
            save: () => Promise<object>;
            /**
             * @returns {Promise<object>} data before deleting
             */
            del: () => Promise<object>;
        };
        /**
         * @returns {Promise<any[]>}
         */
        read: () => Promise<any[]>;
        /**
         * @param {object} obj
         */
        match: (obj: object) => boolean;
        /**
         * @returns {string} this schema name
         */
        readonly schem: string;
        /**
         * @param {object} obj
         * @param {boolean} except
         */
        find: (obj?: object, except?: boolean) => Promise<any[]>;
        /**
         * @param {object} obj
         * @param {boolean} except
         */
        findOne: (obj?: object, except?: boolean) => Promise<any>;
        /**
         * @returns {Promise<void>}
         */
        clear: () => Promise<void>;
        /**
         * @param {object} obj
         * @param {boolean} except
         */
        deleteMatch: (obj?: object, except?: boolean) => Promise<void>;
    };
    /**
     * @returns {Promise<void>}
     */
    clear: () => Promise<void>;
    /**
     * @param {Function} schema
     */
    drop: (schema: Function) => Promise<void>;
    #private;
}
//# sourceMappingURL=JsonDB.d.ts.map