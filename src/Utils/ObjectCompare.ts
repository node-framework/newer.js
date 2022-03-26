export default function compare(a: any, b: any): boolean {
    // Manual check
    if (a === b)
        return true;

    if (!a || !b || (a !== b && typeof a !== 'object'))
        return false;

    // Properties check
    for (const prop in a) 
        if (!compare(a[prop], b[prop]))
            return false;
    
    // When passed the check
    return true;
}