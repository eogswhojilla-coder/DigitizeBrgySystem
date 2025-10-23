import React, { useEffect, useState } from "react";
import Layout from "../layout";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import AddPositionSection from "./sections/add-position-section";

import SearchPosiSection from "./sections/search-position-section";
import TableSection1 from "./sections/table-section";
import store from "@/app/store/store";
import { get_positions_thunk } from "@/app/redux/position-thunk";




function PositionManagementTable() {
    const [positions, setPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPositions = positions.filter((pos) =>
        pos.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        store.dispatch(get_positions_thunk());
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className=" space-y-6">
                {/* Header */}
                <AddPositionSection />

                {/* Search */}

                <SearchPosiSection />
                {/* Table */}
                <TableSection1 />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Layout>
            <PositionManagementTable />
        </Layout>
    );
}
