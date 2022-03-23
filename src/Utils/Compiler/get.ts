export default (line: string, db: any) => 
    db.schema(
        // Get schema name
        line.slice(
            line.indexOf("get from ") + 9,
            line.indexOf(" where")
        ).trim()
    ).find(
        // Parse the object
        JSON.parse(
            // Get the object
            line.slice(
                line.indexOf("where") + 5,
                line.length
            )
        )
    )