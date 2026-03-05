import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function PaginationSection({ pagination, rowsPerPage, onRowsPerPageChange }) {
  const handlePageChange = (url) => {
    if (url) {
      router.visit(url, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  if (!pagination) return null;

  const { current_page, last_page, from, to, total, links } = pagination;

  return (
    <div>
      <div className="flex justify-between items-center mt-4 bg-gray-100 p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 text-sm font-medium">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-6 py-2 text-sm bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="text-sm text-gray-700 font-medium">
          Showing {from || 0} to {to || 0} of {total || 0} entries
        </div>

        <div className="flex items-center space-x-1">
          <button 
            onClick={() => handlePageChange(links?.[0]?.url)}
            disabled={current_page === 1}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              const prevLink = links?.find(link => link.label === '&laquo; Previous');
              handlePageChange(prevLink?.url);
            }}
            disabled={current_page === 1}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Page Numbers */}
          <div className="flex items-center space-x-1 mx-2">
            {links?.slice(1, -1).map((link, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(link.url)}
                disabled={link.active}
                className={`min-w-[32px] h-8 px-2 text-sm rounded transition-colors ${
                  link.active
                    ? 'bg-blue-600 text-white font-bold cursor-default'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              const nextLink = links?.find(link => link.label === 'Next &raquo;');
              handlePageChange(nextLink?.url);
            }}
            disabled={current_page === last_page}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handlePageChange(links?.[links.length - 1]?.url)}
            disabled={current_page === last_page}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

