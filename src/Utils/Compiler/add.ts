export default async (line: string, db: any) => {
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
        line.slice(line.indexOf("object ") + 7, line.length)
    );

    // Add the object
    await new SchemaObject(objectToAdd).save();
}