import React, { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import Table from '@/app/_components/table';

export default function TableSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL POSITION');

  const officials = [
    {
      id: 2,
      image: '/api/placeholder/40/40',
      position: 'CHAIRMAN',
      positionColor: 'bg-green-600',
      officialNumber: '040320251137084573',
      name: 'Wacky D. Hojilla',
      pwd: 'NO',
      singleParent: 'NO',
      voters: 'YES',
      status: 'NOT ACTIVE',
    },
  ];

  // Filter by search and position
  const filteredOfficials = officials.filter(official => {
    const matchesSearch = 
      official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = 
      positionFilter === 'ALL POSITION' || 
      official.position === positionFilter;

    return matchesSearch && matchesPosition;
  });

  // Define columns
  const columns = [
    {
      header: 'Image',
      accessor: 'image',
    },
    {
      header: (
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="bg-white/40 border border-gray-600 rounded px-7 py-1 text-xs"
        >
          <option>ALL POSITION</option>
          <option>KAGAWAD</option>
          <option>CHAIRMAN</option>
          <option>SECRETARY</option>
          <option>SK KAGAWAD</option>
        </select>
      ),
      accessor: 'position',
    },
    {
      header: 'Official Number',
      accessor: 'officialNumber',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'PWD',
      accessor: 'pwd',
    },
    {
      header: 'Single Parent',
      accessor: 'singleParent',
    },
    {
      header: 'Voters',
      accessor: 'voters',
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Action',
      accessor: 'action',
    },
  ];

  // Transform data for table
  const tableData = filteredOfficials.map((official) => ({
    image: (
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-gray-600 text-xs">IMG</span>
      </div>
    ),
    position: (
      <span
        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${official.positionColor}`}
      >
        {official.position}
      </span>
    ),
    officialNumber: official.officialNumber,
    name: <span className="font-medium">{official.name}</span>,
    pwd: (
      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        {official.pwd}
      </span>
    ),
    singleParent: (
      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        {official.singleParent}
      </span>
    ),
    voters: (
      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        {official.voters}
      </span>
    ),
    status: (
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
        <span className="text-red-600 font-medium">{official.status}</span>
      </div>
    ),
    action: (
      <div className="flex space-x-2">
        <button className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      {/* Search Input */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Table columns={columns} data={tableData} />
    </div>
  );
}
