import { router } from "@inertiajs/react";
import { Edit2, X } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";

export default function TableSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [positionFilter, setPositionFilter] = useState("ALL POSITION");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { officials } = useSelector((store) => store.barangay_residents);

    // ✅ Static fallback data
    const residents = [
        {
            id: 1,
            image: "/api/placeholder/40/40",
            position: "KAGAWAD",
            positionColor: "bg-green-500",
            officialNumber: "040520251157345802",
            name: "Christine M. Maquilang",
            pwd: "NO",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
        },
        {
            id: 2,
            image: "/api/placeholder/40/40",
            position: "CHAIRMAN",
            positionColor: "bg-green-600",
            officialNumber: "040320251137084573",
            name: "Wacky D. Hojilla",
            pwd: "NO",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
        },
        {
            id: 3,
            image: "/api/placeholder/40/40",
            position: "SK KAGAWAD",
            positionColor: "bg-green-400",
            officialNumber: "040520251153333372",
            name: "Ayesha M. Dela cruz",
            pwd: "NO",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
        },
        {
            id: 4,
            image: "/api/placeholder/40/40",
            position: "SECRETARY",
            positionColor: "bg-purple-500",
            officialNumber: "040820251500582572",
            name: "Wakin D. Hojilla",
            pwd: "NO",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
        },
        {
            id: 5,
            image: "/api/placeholder/40/40",
            position: "KAGAWAD",
            positionColor: "bg-green-500",
            officialNumber: "040520251151410491",
            name: "Janvee M. Romano",
            pwd: "NO",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
        },
    ];

    // ✅ Normalize officials
    const data = Array.isArray(officials?.data)
        ? officials.data
        : Array.isArray(officials)
        ? officials
        : residents;

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
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{official.status}</span>
            </div>
        ),
        action: (
            <div className="flex space-x-2">
                <button
                    onClick={() => console.log("Edit", official.id)}
                    className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                >
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
            <Table columns={columns} data={tableData} />
        </div>
    );
}
