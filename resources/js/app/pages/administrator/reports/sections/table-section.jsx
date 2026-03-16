import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Table from "@/app/_components/table";
import Pagination from "@/app/_components/pagination";

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

    // Prepare pagination data for Pagination component
    const paginationData = {
        current_page: currentPage,
        last_page: totalPages,
        total: residents.length,
        per_page: itemsPerPage,
        from: startIndex + 1,
        to: Math.min(endIndex, residents.length),
        onPageChange: (page) => setCurrentPage(page),
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

                        {/* Use shared Pagination component */}
                        <div className="border-t bg-gray-50 px-3 sm:px-6 py-3 sm:py-4">
                            <Pagination data={paginationData} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
