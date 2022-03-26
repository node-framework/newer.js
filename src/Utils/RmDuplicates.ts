import compare from "./ObjectCompare";

export default function rmDuplicates(arr: any[]) {
    // Some fields
    let arrSize = arr.length;
    let searchingForDupsIndex = 0;
    let needToDelIndexes = [];

    while (searchingForDupsIndex < arrSize) {
        // Loop through array elements
        for (let i = searchingForDupsIndex + 1; i < arrSize; i++) 
            // Compare two index
            if (compare(arr[i], arr[searchingForDupsIndex]))
                needToDelIndexes.push(i);

        // Delete the indexes
        arrSize -= needToDelIndexes.length;

        // Delete elements
        needToDelIndexes.forEach(
            i => 
                arr.splice(i, 1)
        );

        // Next search
        searchingForDupsIndex++;
        needToDelIndexes = [];
    }
}