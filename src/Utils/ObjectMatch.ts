export default function match(obj1: object, obj2: object) {
    if (obj1 === obj2) 
        return true;
    for (let i in obj1)
        if (!match(obj1[i], obj2[i]))
            return false;
    return true;
}