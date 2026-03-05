import React from 'react';
import { Eye } from 'lucide-react';
import Table from '@/app/_components/table';

export default function TableSection({ officials, positionFilter, onPositionFilterChange, onViewDetails }) {
  // Get position color
  const getPositionColor = (position) => {
    const colors = {
      'KAGAWAD': 'bg-blue-600',
      'CHAIRMAN': 'bg-green-600',
      'SECRETARY': 'bg-purple-600',
      'SK KAGAWAD': 'bg-orange-600',
      'SK CHAIRMAN': 'bg-teal-600',
      'TREASURER': 'bg-pink-600',
    };
    return colors[position] || 'bg-gray-600';
  };

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
          onChange={(e) => onPositionFilterChange(e.target.value)}
          className="bg-white/40 border border-gray-600 rounded px-7 py-1 text-xs font-semibold cursor-pointer hover:bg-white/60 transition-colors"
        >
          <option>ALL POSITION</option>
          <option>KAGAWAD</option>
          <option>CHAIRMAN</option>
          <option>SECRETARY</option>
          <option>SK KAGAWAD</option>
          <option>SK CHAIRMAN</option>
          <option>TREASURER</option>
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
      header: 'Term Period',
      accessor: 'termPeriod',
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
  const tableData = officials.map((official) => ({
    image: (
      <div className="flex items-center justify-center">
        {official.image ? (
          <img
            src={official.image}
            alt={official.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-xs font-bold">
              {official.name?.charAt(0) || 'N'}
            </span>
          </div>
        )}
      </div>
    ),
    position: (
      <span
        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getPositionColor(official.position)}`}
      >
        {official.position}
      </span>
    ),
    officialNumber: (
      <span className="text-sm text-gray-700">{official.officialNumber}</span>
    ),
    name: <span className="font-medium text-gray-900">{official.name}</span>,
    pwd: (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        official.pwd === 'YES' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {official.pwd}
      </span>
    ),
    singleParent: (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        official.singleParent === 'YES' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {official.singleParent}
      </span>
    ),
    voters: (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        official.voters === 'YES' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {official.voters}
      </span>
    ),
    termPeriod: (
      <div className="text-xs text-gray-600">
        <div>{official.termFrom || 'N/A'}</div>
        <div className="text-gray-400">to</div>
        <div>{official.termTo || 'N/A'}</div>
      </div>
    ),
    status: (
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
        <span className="text-red-600 font-medium text-sm">TERM ENDED</span>
      </div>
    ),
    action: (
      <div className="flex space-x-2 justify-center">
        <button 
          onClick={() => onViewDetails(official)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    ),
  }));

  return (
    <div>
      {officials.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Officials with Ended Terms</h3>
          <p className="text-sm text-gray-500">There are no officials whose terms have ended yet.</p>
        </div>
      ) : (
        <Table columns={columns} data={tableData} />
      )}
    </div>
  );
}

