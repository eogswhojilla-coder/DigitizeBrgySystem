import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Table from "@/app/_components/table";

export default function TableSection() {
    const [residents] = useState([
        {
            name: "Hojilla Wacky D.",
            age: "20",
            pwd: "",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
            senior: "NO",
        },
        {
            name: "Asdasd Asdasd A.",
            age: "",
            pwd: "",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
            senior: "NO",
        },
        {
            name: "Bacarro Jancen P.",
            age: "20",
            pwd: "",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
            senior: "NO",
        },
        {
            name: "Hojilla Wacky D.",
            age: "20",
            pwd: "",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
            senior: "NO",
        },
        {
            name: "Jan Aj S.",
            age: "",
            pwd: "",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
            senior: "NO",
        },
        {
            name: "Pa Pa P.",
            age: "",
            pwd: "",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
            senior: "NO",
        },
        {
            name: "Dela Ayesha M.",
            age: "",
            pwd: "",
            singleParent: "NO",
            voters: "NO",
            status: "ACTIVE",
            senior: "NO",
        },
        {
            name: "Maquilang Christine F.",
            age: "22",
            pwd: "",
            singleParent: "NO",
            voters: "YES",
            status: "ACTIVE",
            senior: "NO",
        },
    ]);

    // Define table columns
    const columns = [
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Age",
            accessor: "age",
        },
        {
            header: "Pwd",
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
            header: "Senior",
            accessor: "senior",
        },
    ];

    // Transform data for table (can add styling here if needed)
    const tableData = residents.map((resident) => ({
        name: resident.name,
        age: resident.age || "-",
        pwd: resident.pwd || "-",
        singleParent: resident.singleParent,
        voters: resident.voters,
        status: resident.status,
        senior: resident.senior,
    }));

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Table columns={columns} data={tableData} />

                {/* Pagination */}
                <div className="flex items-center justify-end gap-4 px-6 py-4 border-t bg-gray-50">
                    <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded">
                            1
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors">
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
