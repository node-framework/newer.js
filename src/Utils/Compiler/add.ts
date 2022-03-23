export default async (line: string, db: any, reviver: (key: string, value: any) => any) => {
    // Get the schema
    const SchemaObject = db.schema(
        // Get the schema name
        line.slice(
            line.indexOf("to ") + 3,
            line.indexOf(" ", line.indexOf("to ") + 3)
        )
    );

    // Get the object to add
    const objectToAdd = JSON.parse(
        line.slice(line.indexOf("object ") + 7, line.length),
        reviver
    );

    // Add the object
    await new SchemaObject(objectToAdd).save();
}