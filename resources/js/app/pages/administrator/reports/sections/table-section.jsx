import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Table from "@/app/_components/table";

export default function TableSection({ residents = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate pagination
    const totalPages = Math.ceil(residents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResidents = residents.slice(startIndex, endIndex);

    // Define table columns
    const columns = [
        {
            header: "#",
            accessor: "index",
        },
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Age",
            accessor: "age",
        },
        {
            header: "Gender",
            accessor: "gender",
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
            header: "Senior",
            accessor: "senior",
        },
    ];

    // Transform data for table
    const tableData = currentResidents.map((resident, index) => ({
        index: startIndex + index + 1,
        name: resident.name,
        age: resident.age || "-",
        gender: resident.gender || "-",
        pwd: resident.pwd || "-",
        singleParent: resident.singleParent || "-",
        voters: resident.voters || "-",
        senior: resident.senior || "-",
    }));

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {residents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No residents found</p>
                        <p className="text-sm mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <>
                        <Table columns={columns} data={tableData} />

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t bg-gray-50">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, residents.length)} of {residents.length} residents
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageClick(page)}
                                            className={`px-3 py-1 rounded transition-colors ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
