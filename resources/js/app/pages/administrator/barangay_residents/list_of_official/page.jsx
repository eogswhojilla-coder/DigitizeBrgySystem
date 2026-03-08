import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import {
    Edit2,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
} from "lucide-react";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import PaginationSection from "./sections/pagination-section";
import ViewDetailSection from "./sections/view-detail-section";
import store from "@/app/store/store";
import { get_barangay_officials_thunk } from "@/app/redux/barangay-official-thunk";

const DataTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOfficial, setSelectedOfficial] = useState(null);

    useEffect(() => {
        store.dispatch(get_barangay_officials_thunk());
    }, []);

    const handleViewDetails = (official) => {
        setSelectedOfficial(official);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = (value) => {
        setIsViewModalOpen(value);
        if (!value) {
            setSelectedOfficial(null);
        }
    };

    return (
        <div className="bg-white min-h-screen p-3 sm:p-4 md:p-6">
            {/* Header */}
            <SearchSection />
            {/* Table */}

            <TableSection onViewDetails={handleViewDetails} />
            {/* Pagination */}

            <PaginationSection />

            <ViewDetailSection 
                isOpen={isViewModalOpen}
                onClose={handleCloseModal}
                official={selectedOfficial}
            />
        </div>
    );
};

export default function Page() {
    return (
        <Layout>
            <DataTable />
        </Layout>
    );
}
