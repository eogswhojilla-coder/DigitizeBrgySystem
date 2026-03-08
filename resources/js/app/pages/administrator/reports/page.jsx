import React, { useState } from "react";
import { Printer } from "lucide-react";
import Layout from "../layout";
import { usePage, router } from "@inertiajs/react";
import SearchReportSection from "./sections/search-report-section";
import TableSection from "./sections/table-section";
import Button from "@/app/_components/button";

export default function Page() {
    const { residents, filters: initialFilters, totalCount } = usePage().props;

    return (
        <Layout>
            <ResidentReport 
                residents={residents} 
                initialFilters={initialFilters}
                totalCount={totalCount}
            />
        </Layout>
    );
}

function ResidentReport({ residents, initialFilters, totalCount }) {
    const [filters, setFilters] = useState({
        voters: initialFilters?.voters || "",
        age: initialFilters?.age || "",
        pwd: initialFilters?.pwd || "",
        singleParent: initialFilters?.singleParent || "",
        senior: initialFilters?.senior || "",
    });

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleFilter = () => {
        // Send filters to backend
        router.get('/administrator/reports', filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setFilters({
            voters: "",
            age: "",
            pwd: "",
            singleParent: "",
            senior: "",
        });
        // Reset filters on backend
        router.get('/administrator/reports', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleGeneratePdf = () => {
        // Generate PDF with current filters
        const queryParams = new URLSearchParams(filters).toString();
        window.open(`/administrator/reports/generate-pdf?${queryParams}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
            <div className="">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Resident Report
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Total Residents: {totalCount}
                        </p>
                    </div>
                    <Button
                        onClick={handleGeneratePdf}
                        variant="warning"
                        className="flex items-center gap-2"
                    >
                        <Printer size={16} />
                        GENERATE PDF
                    </Button>
                </div>

                {/* Filter Section */}
                <SearchReportSection 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilter={handleFilter}
                    onReset={handleReset}
                />

                {/* Table Section */}
                <TableSection residents={residents} />
            </div>
        </div>
    );
}
