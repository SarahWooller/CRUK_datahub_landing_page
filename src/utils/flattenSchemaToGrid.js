export const flattenSchemaToGrid = (savedTables) => {
  if (!savedTables || !Array.isArray(savedTables)) return [];

  const flatRows = [];
  let rowId = 0;

  savedTables.forEach(table => {
    // Handle empty tables
    if (!table.columns || table.columns.length === 0) {
      flatRows.push({
        id: rowId++,
        tableName: table.name || "",
        tableDescription: table.description || "",
        tableSize: table.size || ""
      });
      return;
    }

    table.columns.forEach(col => {
      // Handle columns with no specific values
      if (!col.values || col.values.length === 0) {
        flatRows.push({
          id: rowId++,
          tableName: table.name || "",
          tableDescription: table.description || "",
          tableSize: table.size || "",
          columnName: col.name || "",
          columnDataType: col.dataType || "",
          columnDescription: col.description || "",
          columnSensitive: col.sensitive ? "true" : "false"
        });
        return;
      }

      // Handle fully populated rows with values
      col.values.forEach(val => {
        flatRows.push({
          id: rowId++,
          tableName: table.name || "",
          tableDescription: table.description || "",
          tableSize: table.size || "",
          columnName: col.name || "",
          columnDataType: col.dataType || "",
          columnDescription: col.description || "",
          columnSensitive: col.sensitive ? "true" : "false",
          valueName: val.name || "",
          valueDescription: val.description || "",
          valueFrequency: val.frequency || ""
        });
      });
    });
  });

  return flatRows;
};