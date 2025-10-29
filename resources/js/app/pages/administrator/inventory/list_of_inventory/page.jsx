import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Package, Search, Filter } from "lucide-react";
import Layout from "../../layout";
import Button from "@/app/_components/button";
import SearchInventorySection from "./sections/search-inventory-section";
import AddInventorySection from "./sections/add-inventory-section";
import TableInventorySection from "./sections/table-inventory-section";
import { get_inventories_thunk } from "@/app/redux/inventories-thunk";
import store from "@/app/store/store";
import PaginationSection from "./sections/pagination-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_inventories_thunk());
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Add Button on Left */}

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <SearchInventorySection />
                </div>
                <div className="justify-end">
                    <AddInventorySection />
                </div>

                {/* Items List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <TableInventorySection />
                </div>

                {/* Pagination */}
                <div className="mt-4">
                    <PaginationSection />
                </div>
            </div>
        </Layout>
    );
}
