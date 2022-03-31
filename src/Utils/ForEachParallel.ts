/**
 * For each parallel
 */
export default async<T>(arr: T[], func: (item: T) => Promise<void> | void) => 
    Promise.all(
        arr.map(
            async (item: T) => func(item)
        )
    );