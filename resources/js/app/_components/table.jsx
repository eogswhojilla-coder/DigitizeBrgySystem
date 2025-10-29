import React from 'react';

const Table = ({ columns, data, emptyMessage = "No data found" }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-sm">
        <thead className="bg-blue-100">
          <tr>
            {columns?.map((col, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-medium text-blue-700 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {!data || data.length === 0 ? (
            <tr>
              <td colSpan={columns?.length} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data?.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-3 text-sm text-gray-800">
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
