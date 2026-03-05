import { router } from "@inertiajs/react";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";

export default function TableSection({ onViewDetails }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [positionFilter, setPositionFilter] = useState("ALL POSITION");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { officials } = useSelector((store) => store.barangay_officials);

    // Helper function to get position color
    const getPositionColor = (position) => {
        const pos = position?.toUpperCase() || '';
        if (pos.includes('CHAIRMAN') || pos.includes('CAPTAIN')) return 'bg-red-600';
        if (pos.includes('KAGAWAD')) return 'bg-green-500';
        if (pos.includes('SK')) return 'bg-green-400';
        if (pos.includes('SECRETARY')) return 'bg-purple-500';
        if (pos.includes('TREASURER')) return 'bg-blue-500';
        return 'bg-gray-500';
    };

    // ✅ Normalize officials data from API
    const data = Array.isArray(officials?.data)
        ? officials.data.map(official => ({
            id: official.id,
            image: official.profileImage ? `/images/residents/${official.profileImage}` : "/api/placeholder/40/40",
            position: official.position || 'N/A',
            positionColor: getPositionColor(official.position),
            officialNumber: official.residentId || 'N/A',
            name: `${official.firstName || ''} ${official.middleName ? official.middleName.charAt(0) + '.' : ''} ${official.lastName || ''}`.trim(),
            pwd: official.pwd === 'yes' ? 'YES' : 'NO',
            singleParent: official.singleParent === 'yes' ? 'YES' : 'NO',
            voters: official.voters === 'yes' || official.voters === 'registered' ? 'YES' : 'NO',
            status: 'ACTIVE',
            fullData: official, // Keep full official data for detail view
        }))
        : [];

    // ✅ Safe filtering by search and position
    const filteredOfficials = data.filter((o) => {
        const matchesSearch =
            o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.position.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPosition =
            positionFilter === "ALL POSITION" ||
            o.position === positionFilter;

        return matchesSearch && matchesPosition;
    });

    // Define columns with custom header for position
    const columns = [
        {
            header: "Image",
            accessor: "image",
        },
        {
            header: (
                <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="bg-white/40 border border-gray-600 rounded px-2 py-1 text-xs"
                >
                    <option>ALL POSITION</option>
                    <option>KAGAWAD</option>
                    <option>CHAIRMAN</option>
                    <option>SECRETARY</option>
                    <option>SK KAGAWAD</option>
                </select>
            ),
            accessor: "position",
        },
        {
            header: "Official Number",
            accessor: "officialNumber",
        },
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "PWD",
            accessor: "pwd",
        },
        {
            header: "Single Parent",
            accessor: "singleParent",
        },
        {
            header: "Voters",
            accessor: "voters",
        },
        {
            header: "Status",
            accessor: "status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    // Transform data for table
    const tableData = filteredOfficials.map((official) => ({
        image: (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {official.image && official.image !== '/api/placeholder/40/40' ? (
                    <img src={official.image} alt={official.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-600 text-xs">IMG</span>
                )}
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
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{official.status}</span>
            </div>
        ),
        action: (
            <div className="flex space-x-2 justify-center">
                <button
                    onClick={() => onViewDetails(official.fullData)}
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
            <Table columns={columns} data={tableData} />
        </div>
    );
}
