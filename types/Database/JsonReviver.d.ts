export default class JsonReviver {
    private reviver;
    constructor();
    setReviverOf: (propName: string, converter: (value: any) => any) => (value: any) => any;
    callback: () => (key: string, value: any) => any;
}
