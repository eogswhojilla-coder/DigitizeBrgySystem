import React, { useState } from 'react'
import Table from "@/app/_components/table";

export default function TableSystemLogsSection() {
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

    // Define table columns
    const columns = [
        {
            header: "No. ↕",
            accessor: "id",
        },
        {
            header: "Message ↕",
            accessor: "message",
        },
        {
            header: "Date ↕",
            accessor: "date",
        },
    ];

    // Transform logs data for the table
    const tableData = currentLogs.map((log) => {
        const messageType = getMessageType(log.message);
        const messageColor = getMessageColor(messageType);

        return {
            id: <span className="font-medium">{log.id}</span>,
            message: (
                <span className={`px-2 py-1 rounded text-sm font-medium ${messageColor}`}>
                    {log.message}
                </span>
            ),
            date: <span className="font-mono text-sm">{log.date}</span>,
        };
    });

    return (
        <>
            <Table columns={columns} data={tableData} />
        </>
    );
}
