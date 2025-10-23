import React, { useState } from "react";
import { Edit } from "lucide-react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";

export default function TableSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const { blotters } = useSelector((store) => store.blotters);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    console.log("blotters", blotters);

    // Use blotters data or empty array
    const data = blotters?.data || [];

    const handleSelectAll = (checked) => {
        setSelectedItems(checked ? data.map((r) => r.id) : []);
    };

    const handleSelectItem = (id, checked) => {
        setSelectedItems((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    // Filter blotters based on search term
    const filteredBlotters = data.filter((blotter) =>
        Object.values(blotter).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Define table columns
    const columns = [
        {
            header: (
                <input
                    type="checkbox"
                    checked={
                        selectedItems.length === filteredBlotters.length &&
                        filteredBlotters.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            ),
            accessor: "checkbox",
        },
        {
            header: "Blotter No.",
            accessor: "blotterNumber",
        },
        {
            header: "Status",
            accessor: "status",
        },
        {
            header: "Remarks",
            accessor: "remarks",
        },
        {
            header: "Incident",
            accessor: "incident",
        },
        {
            header: "Location",
            accessor: "location",
        },
        {
            header: "Date Incident",
            accessor: "dateIncident",
        },
        {
            header: "Date Reported",
            accessor: "dateReported",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    // Transform blotters data for the table
    const tableData = filteredBlotters.map((blotter) => ({
        checkbox: (
            <input
                type="checkbox"
                checked={selectedItems.includes(blotter.id)}
                onChange={(e) =>
                    handleSelectItem(blotter.id, e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
        ),
        blotterNumber: (
            <span className="font-medium text-blue-600">
                {blotter.blotterNumber || "N/A"}
            </span>
        ),
        status: (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {blotter.status}
            </span>
        ),
        remarks: (
            <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                {blotter.remarks}
            </span>
        ),
        incident: blotter.incident,
        location: blotter.location_of_incident,
        dateIncident: blotter.date_of_incident,
        dateReported: blotter.date_reported,
        action: (
            <button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 p-2 rounded transition-colors">
                <Edit size={16} />
            </button>
        ),
    }));

    return (
        <div>
            {/* Controls Section */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Show</span>
                    <select
                        value={entriesPerPage}
                        onChange={(e) =>
                            setEntriesPerPage(Number(e.target.value))
                        }
                        className="border border-gray-300 rounded px-6 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[10, 25, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <span className="text-gray-600">entries</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Search:</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search records..."
                    />
                </div>
            </div>

            {/* Table Section */}
            {filteredBlotters.length > 0 ? (
                <Table columns={columns} data={tableData} />
            ) : (
                <div className="px-6 py-8 text-center text-gray-500 bg-white border border-gray-300 rounded-lg">
                    No blotter records found
                </div>
            )}
        </div>
    );
}
