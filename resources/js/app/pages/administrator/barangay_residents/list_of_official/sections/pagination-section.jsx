import React, { useState } from 'react'
import { Edit2, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
export default function PaginationSection() {
     const [searchTerm, setSearchTerm] = useState('');
      const [rowsPerPage, setRowsPerPage] = useState(10);

       const officials = [
    {
      id: 1,
      image: '/api/placeholder/40/40',
      position: 'KAGAWAD',
      positionColor: 'bg-green-500',
      officialNumber: '040520251157345802',
      name: 'Christine M. Maquilang',
      pwd: 'NO',
      singleParent: 'NO',
      voters: 'YES',
      status: 'ACTIVE'
    },
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
      status: 'ACTIVE'
    },
    {
      id: 3,
      image: '/api/placeholder/40/40',
      position: 'SK KAGAWAD',
      positionColor: 'bg-green-400',
      officialNumber: '040520251153333372',
      name: 'Ayesha M. Dela cruz',
      pwd: 'NO',
      singleParent: 'NO',
      voters: 'YES',
      status: 'ACTIVE'
    },
    {
      id: 4,
      image: '/api/placeholder/40/40',
      position: 'SECRETARY',
      positionColor: 'bg-purple-500',
      officialNumber: '040820251500582572',
      name: 'Wakin D. Hojilla',
      pwd: 'NO',
      singleParent: 'NO',
      voters: 'YES',
      status: 'ACTIVE'
    },
    {
      id: 5,
      image: '/api/placeholder/40/40',
      position: 'KAGAWAD',
      positionColor: 'bg-green-500',
      officialNumber: '040520251151410491',
      name: 'Janvee M. Romano',
      pwd: 'NO',
      singleParent: 'NO',
      voters: 'YES',
      status: 'ACTIVE'
    }
  ];

  const filteredOfficials = officials.filter(official =>
    official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    official.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
          Showing 0 to 0 of {filteredOfficials.length} entries
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
