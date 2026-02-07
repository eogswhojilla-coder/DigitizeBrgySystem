import React, { useState } from 'react'
import { Edit2, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function PaginationSection() {
     const [searchTerm, setSearchTerm] = useState('');
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const { officials } = useSelector((store) => store.barangay_officials);

      // Get pagination data from API response
      const paginationData = officials?.data ? {
        current_page: officials.current_page || 1,
        last_page: officials.last_page || 1,
        per_page: officials.per_page || 10,
        total: officials.total || 0,
        from: officials.from || 0,
        to: officials.to || 0,
      } : {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
      };
  return (
    <div>

<div className="flex justify-between items-center mt-4 bg-gray-100 p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 text-sm">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-6 py-1 text-sm bg-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="text-sm text-gray-700">
          Showing {paginationData.from} to {paginationData.to} of {paginationData.total} entries
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded">
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded">
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  )
}
