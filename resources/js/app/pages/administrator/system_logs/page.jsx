import React, { useState } from 'react';
import Layout from '../layout';
import { FileText, Search } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';

export default function Page() {
  return (
    <Layout>
      <SystemLogs />
    </Layout>
  );
}

const SystemLogs = () => {
  const { logs, search: initialSearch, perPage: initialPerPage } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [rowsPerPage, setRowsPerPage] = useState(initialPerPage || 10);

  const handleSearch = (value) => {
    setSearchTerm(value);
    router.get(route('system_logs.index'), {
      search: value,
      per_page: rowsPerPage,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    router.get(route('system_logs.index'), {
      search: searchTerm,
      per_page: value,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const getMessageColor = (action) => {
    switch (action?.toUpperCase()) {
      case 'LOGIN': return 'text-green-700 bg-green-50 border-green-200';
      case 'LOGOUT': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'CREATE':
      case 'ADD':
      case 'ADDED': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'UPDATE':
      case 'EDIT': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'DELETE': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getUserTypeBadgeColor = (userType) => {
    switch (userType?.toUpperCase()) {
      case 'ADMIN': return 'bg-blue-600 text-white';
      case 'SECRETARY': return 'bg-purple-600 text-white';
      case 'TREASURER': return 'bg-green-600 text-white';
      case 'INVENTORY OFFICER': return 'bg-orange-600 text-white';
      case 'SYSTEM': return 'bg-gray-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
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
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-5 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-700">SEARCH:</span>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchTerm);
                    }
                  }}
                  onBlur={() => handleSearch(searchTerm)}
                  className="border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search logs..."
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    No. ↕
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Message ↕
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date ↕
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.data && logs.data.length > 0 ? (
                  logs.data.map((log, index) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {log.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getUserTypeBadgeColor(log.user_type)}`}>
                          {log.user_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded border text-xs font-semibold ${getMessageColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {log.message}
                        </div>
                        {log.ip_address && (
                          <div className="text-xs text-gray-500 mt-1">
                            IP: {log.ip_address}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {log.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {logs.data && logs.data.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing {logs.from} to {logs.to} of {logs.total} entries
              </div>
              <div className="flex gap-1">
                {/* Pagination controls */}
                {logs.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (link.url) {
                        router.visit(link.url, {
                          preserveState: true,
                          replace: true,
                        });
                      }
                    }}
                    disabled={!link.url}
                    className={`px-3 py-1 rounded ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : link.url
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};