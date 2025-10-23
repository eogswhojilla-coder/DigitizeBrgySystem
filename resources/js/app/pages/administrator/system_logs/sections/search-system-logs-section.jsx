import { Search } from 'lucide-react'
import React, { useState } from 'react'

export default function SearchSystemLogsSection() {
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

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="text-gray-700">SEARCH:</span>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search logs..."
                    />
                </div>
            </div>
        </>
    )
}
