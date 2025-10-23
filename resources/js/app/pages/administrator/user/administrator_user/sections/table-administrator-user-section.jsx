import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import DeleteSection from "./delete-section";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";

export default function TableAdministratorUserSection() {
    const { administrators } = useSelector((store) => store.administrators);
    const [searchTerm, setSearchTerm] = useState("");

    console.log("administrators", administrators);

    // Define table columns
    const columns = [
        {
            header: "Image",
            accessor: "image",
        },
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Username",
            accessor: "username",
        },
        {
            header: "Password",
            accessor: "password",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    // Transform administrators data for the table
    const tableData = administrators?.data?.map((administrator) => ({
        image: (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                {administrator.image || "NA"}
            </div>
        ),
        name: (
            <span className="font-medium">
                {administrator.firstName} {administrator.middleName} {administrator.lastName}
            </span>
        ),
        username: administrator.username,
        password: (
            <span className="font-mono text-gray-500">
                {administrator.password}
            </span>
        ),
        action: (
            <div className="flex space-x-2">
                <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors">
                    <Edit2 className="w-4 h-4" />
                </button>
                <DeleteSection data={administrator} />
            </div>
        ),
    })) || [];

    return (
        <div>
            <Table columns={columns} data={tableData} />
        </div>
    );
}
