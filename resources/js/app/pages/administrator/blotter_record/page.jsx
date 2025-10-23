import React, { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Edit,
    X,
    User,
    Users,
    MapPin,
    Calendar,
    FileText,
    AlertCircle,
    MessageSquare,
} from "lucide-react";
import Layout from "../layout";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import SearchSection from "./sections/search-section";
import TableSection from "./sections/table-section";
import DeleteButtonSection from "./sections/delete-button-section";
import NewRecordSection from "./sections/new-record-section";
import store from "@/app/store/store";
import { get_blotters_thunk } from "@/app/redux/blotter-thunk";
import PaginationSection from "./sections/pagination-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_blotters_thunk());
    }, []);
    return (
        <Layout>
            <RecordsTable />
        </Layout>
    );
}

function RecordsTable() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <NewRecordSection />
                    {/* Controls */}
                    {/* <SearchSection /> */}
                    {/* Table */}
                    <TableSection />
                    {/* Footer */}
                </div>
            </div>
             <div className='mt-4'><PaginationSection /></div>
        </div>
    );
}
