import React, { useState } from "react";
import {
    Layers,
    Filter,
    RotateCcw,
    Printer,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Layout from "../layout";
import SearchReportSection from "./sections/search-report-section";
import TableSection from "./sections/table-section";

export default function Page() {
    return (
        <Layout>
            <ResidentReport />
        </Layout>
    );
}

function ResidentReport() {
    const [filters, setFilters] = useState({
        voters: "",
        age: "",
        status: "",
        pwd: "",
        singleParent: "",
        senior: "",
    });

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleFilter = () => {
        console.log("Filtering with:", filters);
    };

    const handleReset = () => {
        setFilters({
            voters: "",
            age: "",
            status: "",
            pwd: "",
            singleParent: "",
            senior: "",
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="">
                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Resident Report
                </h1>

                {/* Filter Section */}
                <SearchReportSection />
                {/* Print Button */}
                <div className="mb-4">
                    <button
                        onClick={handlePrint}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        <Printer size={16} />
                        PRINT
                    </button>
                </div>

                {/* Table Section */}
                <TableSection />
            </div>
        </div>
    );
}
