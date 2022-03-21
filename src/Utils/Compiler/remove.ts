export default async (line: string, db: any) => {
    // Get the schema
    const SchemaObject = db.schema(
        // Get the schema name
        line.slice(
            line.indexOf("from ") + 5,
            line.indexOf(" ", line.indexOf("from ") + 5)
        ).trim()
    );

    // Find the item
    await SchemaObject.deleteMatch(
        // Get the search object
        JSON.parse(
            line.slice(
                line.indexOf("where ") + 6,
                line.length
            ).trim()
        )
    );
}