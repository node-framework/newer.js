export default function compare(a: any, b: any): boolean {
    if (!a || !b)
        return false;

    // Manual check
    if (a === b)
        return true;

    // Properties check
    for (const prop in a) 
        if (!compare(a[prop], b[prop]))
            return false;
    
    // When passed the check
    return true;
}