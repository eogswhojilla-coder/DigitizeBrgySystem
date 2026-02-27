import { Search } from "lucide-react";
import React, { useState } from "react";

export default function SearchSystemLogsSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="text-gray-700">SEARCH:</span>
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
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
    );
}
