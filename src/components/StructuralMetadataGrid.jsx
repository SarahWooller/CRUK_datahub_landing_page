import React, { useState, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

// 1. Dedicated Editor for React Data Grid
const TextEditor = ({ row, column, onRowChange, onClose }) => {
  return (
    <input
      className="w-full h-full px-2 outline-none border-2 border-indigo-500"
      autoFocus
      value={row[column.key] || ''}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
      onBlur={() => onClose(true)}
      onKeyDown={(e) => { if (e.key === 'Enter') onClose(true); }}
    />
  );
};

// 2. Formatter for Ghost Text
const GhostFormatter = ({ row, column }) => {
  const val = row[column.key];

  if (val !== undefined && val !== null && String(val).trim() !== '') {
    return <span className="text-gray-900">{String(val)}</span>;
  }

  if (row._ghostContext && row._ghostContext[column.key]) {
    return (
      <span style={{ color: '#9CA3AF', fontStyle: 'italic', pointerEvents: 'none', userSelect: 'none' }}>
        {row._ghostContext[column.key]}
      </span>
    );
  }
  return null;
};

// 3. Column Definitions
// 3. Column Definitions
const columns = [
  { key: 'tableName', name: 'Table Name', renderEditCell: TextEditor, resizable: true, width: 200, renderCell: GhostFormatter, headerCellClass: 'bg-blue-100 text-blue-900 font-bold border-r border-blue-200' },
  { key: 'tableDescription', name: 'Table Description', renderEditCell: TextEditor, resizable: true, width: 300, renderCell: GhostFormatter, headerCellClass: 'bg-blue-50 text-blue-900 border-r border-blue-200' },
  { key: 'tableSize', name: 'Table Size', renderEditCell: TextEditor, resizable: true, width: 120, renderCell: GhostFormatter, headerCellClass: 'bg-blue-50 text-blue-900 border-r border-blue-300' },

  { key: 'columnName', name: 'Column Name', renderEditCell: TextEditor, resizable: true, width: 200, renderCell: GhostFormatter, headerCellClass: 'bg-green-100 text-green-900 font-bold border-r border-green-200' },
  { key: 'columnDataType', name: 'Data Type', renderEditCell: TextEditor, resizable: true, width: 150, renderCell: GhostFormatter, headerCellClass: 'bg-green-50 text-green-900 border-r border-green-200' },
  { key: 'columnDescription', name: 'Col Description', renderEditCell: TextEditor, resizable: true, width: 300, renderCell: GhostFormatter, headerCellClass: 'bg-green-50 text-green-900 border-r border-green-200' },
  { key: 'columnSensitive', name: 'Sensitive', renderEditCell: TextEditor, resizable: true, width: 120, renderCell: GhostFormatter, headerCellClass: 'bg-green-50 text-green-900 border-r border-green-300' },

  { key: 'valueName', name: 'Value Name', renderEditCell: TextEditor, resizable: true, width: 200, renderCell: GhostFormatter, headerCellClass: 'bg-orange-100 text-orange-900 font-bold border-r border-orange-200' },
  { key: 'valueDescription', name: 'Value Description', renderEditCell: TextEditor, resizable: true, width: 300, renderCell: GhostFormatter, headerCellClass: 'bg-orange-50 text-orange-900 border-r border-orange-200' },
  { key: 'valueFrequency', name: 'Frequency', renderEditCell: TextEditor, resizable: true, width: 120, renderCell: GhostFormatter, headerCellClass: 'bg-orange-50 text-orange-900' }
];

const StructuralMetadataGrid = ({ initialData, onSaveToSchema }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setRows(initialData);
    }
  }, [initialData]);

  // Evaluates rows and injects the context and the bottom ghost row
  const deriveDisplayRows = (actualRows) => {
    const displayRows = actualRows.map(row => ({ ...row, _ghostContext: {} }));

    let activeTable = null;
    let activeColumn = null;

    displayRows.forEach(row => {
      // Track our position in the hierarchy
      if (row.tableName && String(row.tableName).trim() !== "") {
        activeTable = String(row.tableName).trim();
        activeColumn = null;
      }
      if (row.columnName && String(row.columnName).trim() !== "") {
        activeColumn = String(row.columnName).trim();
      }

      // Inject prompts
      if (row.tableName && String(row.tableName).trim() !== "") {
        if (!row.tableDescription) row._ghostContext.tableDescription = "[Add description]";
        if (!row.tableSize) row._ghostContext.tableSize = "[Add size]";
      }

      if (row.columnName && String(row.columnName).trim() !== "") {
        if (!row.columnDataType) row._ghostContext.columnDataType = "[Type (e.g. string)]";
        if (!row.columnDescription) row._ghostContext.columnDescription = "[Add description]";
        if (!row.columnSensitive) row._ghostContext.columnSensitive = "[true/false]";
      }

      if (row.valueName && String(row.valueName).trim() !== "") {
        if (!row.valueDescription) row._ghostContext.valueDescription = "[Add description]";
        if (!row.valueFrequency) row._ghostContext.valueFrequency = "[Add frequency]";
      }
    });

    if (displayRows.length === 0) {
      return [{ _isGhostRow: true, _ghostContext: { tableName: "[Enter new table name]" } }];
    }

    const bottomGhost = { _isGhostRow: true, _ghostContext: {} };

    if (activeTable) {
       bottomGhost._ghostContext.tableName = `[Add another table]`;
       if (activeColumn) {
         bottomGhost._ghostContext.columnName = `[Add col to ${activeTable}]`;
         bottomGhost._ghostContext.valueName = `[Add value to ${activeColumn}]`;
       } else {
         bottomGhost._ghostContext.columnName = `[Add col to ${activeTable}]`;
       }
    } else {
       bottomGhost._ghostContext.tableName = "[Enter new table name]";
    }

    displayRows.push(bottomGhost);
    return displayRows;
  };

  const handleRowsChange = (newDisplayRows) => {
    const updatedRealRows = newDisplayRows
      .filter(row => {
        return columns.some(col => {
           const val = row[col.key];
           return val !== undefined && val !== null && String(val).trim() !== '';
        });
      })
      .map(row => {
        const { _isGhostRow, _ghostContext, ...cleanRow } = row;
        return cleanRow;
      });

    setRows(updatedRealRows);
  };

  const transformGridToSchema = (flatGridData) => {
    const tableMap = {};
    let currentTableName = null;
    let currentColumnName = null;

    flatGridData.forEach(row => {
      if (row.tableName && String(row.tableName).trim() !== "") {
        currentTableName = String(row.tableName).trim();
        currentColumnName = null;
      }
      if (row.columnName && String(row.columnName).trim() !== "") {
        currentColumnName = String(row.columnName).trim();
      }

      if (!currentTableName) return;

      if (!tableMap[currentTableName]) {
        tableMap[currentTableName] = {
          name: currentTableName,
          description: row.tableDescription || "",
          size: row.tableSize ? parseInt(row.tableSize, 10) : null,
          columns: []
        };
      } else {
        if (row.tableDescription) tableMap[currentTableName].description += " " + row.tableDescription;
        if (row.tableSize) tableMap[currentTableName].size = parseInt(row.tableSize, 10);
      }

      const currentTable = tableMap[currentTableName];

      if (currentColumnName) {
        let currentColumn = currentTable.columns.find(col => col.name === currentColumnName);

        if (!currentColumn && row.columnName) {
          currentColumn = {
            name: currentColumnName,
            dataType: row.columnDataType || "string",
            description: row.columnDescription || "",
            sensitive: String(row.columnSensitive).toLowerCase() === "true",
            values: []
          };
          currentTable.columns.push(currentColumn);
        } else if (currentColumn) {
          if (row.columnDataType) currentColumn.dataType = row.columnDataType;
          if (row.columnDescription) currentColumn.description = row.columnDescription;
          if (row.columnSensitive !== undefined && String(row.columnSensitive).trim() !== "") {
            currentColumn.sensitive = String(row.columnSensitive).toLowerCase() === "true";
          }
        }

        if (row.valueName && String(row.valueName).trim() !== "" && currentColumn) {
          currentColumn.values.push({
            name: String(row.valueName),
            description: row.valueDescription || "",
            frequency: row.valueFrequency ? parseInt(row.valueFrequency, 10) : null
          });
        }
      }
    });

    return { tables: Object.values(tableMap) };
  };

  const handleSave = () => {
    const formattedData = transformGridToSchema(rows);
    onSaveToSchema(formattedData);
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4 bg-gray-50 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Review Structural Metadata</h3>
          <p className="text-sm text-gray-500">Edit cells directly. Type in the ghost rows to add new entries.</p>
        </div>

      </div>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={deriveDisplayRows(rows)}
          onRowsChange={handleRowsChange}
          className="rdg-light h-full"
        />
      </div>
    </div>
  );
};

export default StructuralMetadataGrid;