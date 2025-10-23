import React, { useEffect, useState } from "react";
import { Edit2, X, Search, RotateCcw } from "lucide-react";
import Layout from "../../layout";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import SearchTableSection from "./sections/search-table-section";
import ActionButtonSection from "./sections/action-button-section";
import TableListResident from "./sections/table-list-resident";
import store from "@/app/store/store";
import { get_barangay_residents_thunk } from "@/app/redux/barangay-resident-thunk";
import PaginationSection from "./sections/pagination-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_barangay_residents_thunk());
    }, []);
    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen p-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <SearchTableSection />
                    <ActionButtonSection />
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        <TableListResident />
                    </div>
                </div>
                 <div className="mt-4">
                    <PaginationSection />
                 </div>
            </div>
        </Layout>
    );
}
