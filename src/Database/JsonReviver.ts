export default class JsonReviver {
    private reviver: {
        [name: string]: (value: any) => any; 
    }
    constructor() {
        this.reviver = {};
    }
    setReviverOf = (propName: string, converter: (value: any) => any) =>
        this.reviver[propName] = converter;
    callback = () =>
        (key: string, value: any) => {
            for (let i in this.reviver)
                if (key === i && typeof value === 'string')
                    return (this.reviver[i])(value);
            return value;
        } 
}