import React, { useState } from 'react';
import Layout from '../layout';
import { FileText, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import SearchSystemLogsSection from './sections/search-system-logs-section';
import TableSystemLogsSection from './sections/table-system-logs-section';
import PaginationSystemLogsSection from './sections/pagination-system-logs-section';

export default function Page() {
  return (
    <Layout>
      <SystemLogs />
    </Layout>
  );
}

const SystemLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const logs = [
    {
      id: 1559,
      message: 'ADMIN: Admin KIN | LOGIN',
      date: '20-8-2025 10:36 AM'
    },
    {
      id: 1558,
      message: 'ADMIN: Admin KIN | LOGIN',
      date: '19-8-2025 1:42 PM'
    },
    {
      id: 1557,
      message: 'ADMIN: Admin KIN | LOGIN',
      date: '18-8-2025 9:46 PM'
    },
    {
      id: 1556,
      message: 'OFFICIAL: asdasd asdasd | LOGIN',
      date: '13-8-2025 6:26 PM'
    },
    {
      id: 1555,
      message: 'ADMIN: Admin KIN | LOGOUT',
      date: '13-8-2025 12:26 PM'
    },
    {
      id: 1554,
      message: 'ADMIN: ADDED ADMINISTRATOR - 1840335575660706081320251826120801 | asdasd asdasd',
      date: '13-8-2025 6:26 PM'
    },
    {
      id: 1553,
      message: 'ADMIN: Admin KIN | LOGIN',
      date: '13-8-2025 5:06 PM'
    },
    {
      id: 1552,
      message: 'ADMIN: Admin KIN | LOGIN',
      date: '12-8-2025 5:29 PM'
    },
    {
      id: 1551,
      message: 'ADMIN: ADDED POSITION - 9641038397690763080620250924480341 | POSITION NAME Kawatan | POSITION LIMIT 5',
      date: '6-8-2025 9:24 AM'
    },
    {
      id: 1550,
      message: 'ADMIN: Admin KIN | LOGIN',
      date: '6-8-2025 9:21 AM'
    }
  ];

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = filteredLogs.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const getMessageType = (message) => {
    if (message.includes('LOGIN')) return 'login';
    if (message.includes('LOGOUT')) return 'logout';
    if (message.includes('ADDED')) return 'added';
    return 'default';
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'login': return 'text-green-700 bg-green-50';
      case 'logout': return 'text-orange-700 bg-orange-50';
      case 'added': return 'text-blue-700 bg-blue-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Main Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} />
              SYSTEM LOGS
            </h2>
          </div>

          {/* Controls */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-5 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <SearchSystemLogsSection />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <TableSystemLogsSection />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <PaginationSystemLogsSection />
          </div>
        </div>
      </div>
    </div>
  );
};