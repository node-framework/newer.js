export declare type Schema = {
    new (obj: object): {
        save: () => Promise<object>;
        del: () => Promise<object>;
    };
    read: () => Promise<any[]>;
    match: (obj: object) => boolean;
    schem: string;
    find: (obj?: object, except?: boolean) => Promise<any[]>;
    findOne: (obj?: object, except?: boolean) => Promise<any>;
    clear: () => Promise<void>;
    deleteMatch: (obj?: object, except?: boolean) => Promise<void>;
};
export default class JsonDB {
    #private;
    constructor(...filePaths: string[]);
    get filePath(): string;
    schema: (name: string, schem?: object) => Schema;
    clear: () => Promise<void>;
    drop: (schema: Schema) => Promise<void>;
}
//# sourceMappingURL=JsonDB.d.ts.map