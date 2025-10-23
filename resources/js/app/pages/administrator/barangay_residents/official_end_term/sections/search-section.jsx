import React, { useState } from 'react';
import { Search } from 'lucide-react'; // Assuming you're using lucide-react for the icon

export default function SearchSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
            status: 'NOT ACTIVE'
        }
    ];

    const filteredOfficials = officials.filter(official =>
        official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        official.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg border">
                <div className="flex items-center">
                    <span className="text-gray-700 font-semibold">NUMBER OF OFFICIAL</span>
                    <span className="ml-2 bg-gray-600 text-white px-2 py-1 rounded text-sm">
                        {filteredOfficials.length}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-700 mr-2">SEARCH:</span>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search officials..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
