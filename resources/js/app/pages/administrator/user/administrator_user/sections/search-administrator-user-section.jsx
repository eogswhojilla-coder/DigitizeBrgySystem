import { Search } from 'lucide-react';
import React, { useState } from 'react'

export default function SearchAdministratorUserSection() {
    const users = [
    {
      id: 1,
      name: 'Wacky D. Hojilla',
      username: 'wackyhojilla',
      password: 'wacky12345',
      image: '🧑‍💼'
    },
    {
      id: 2,
      name: 'Secretary S. Secretary',
      username: 'secretary123',
      password: 'secretary123',
      image: '👩‍💼'
    }
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-7 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-700">entries</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700">Search:</span>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search users..."
            />
          </div>
        </div>
      </div>
    </>
  )
}
