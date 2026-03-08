import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import DeleteSection from "./delete-section";
import AssignRoleSection from "./assign-role-section";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";

export default function TableAdministratorUserSection() {
    const { administrators } = useSelector((store) => store.administrators);
    const [searchTerm, setSearchTerm] = useState("");

    console.log("administrators", administrators);

    const getRoleBadgeColor = (roleName) => {
        switch (roleName) {
            case "Super Admin":
                return "bg-purple-100 text-purple-700 border-purple-300";
            case "Admin":
                return "bg-blue-100 text-blue-700 border-blue-300";
            case "Secretary":
                return "bg-green-100 text-green-700 border-green-300";
            case "Treasurer":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "Inventory Officer":
                return "bg-orange-100 text-orange-700 border-orange-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

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
            header: "Role",
            accessor: "role",
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
    const tableData = administrators?.data?.map((administrator) => {
        const roleName = administrator.roles?.[0]?.name || "No Role";
        
        return {
            image: (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                    {administrator.image || "NA"}
                </div>
            ),
            name: (
                <span className="font-medium">
                    {administrator.first_name} {administrator.middle_name} {administrator.last_name}
                </span>
            ),
            username: administrator.username,
            role: (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(roleName)}`}>
                    {roleName}
                </span>
            ),
            password: (
                <span className="font-mono text-gray-500">
                    ••••••••
                </span>
            ),
            action: (
                <div className="flex space-x-2">
                    <AssignRoleSection data={administrator} />
                    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    {roleName !== "Super Admin" && (
                        <DeleteSection data={administrator} />
                    )}
                </div>
            ),
        };
    }) || [];

    return (
        <div>
            <Table columns={columns} data={tableData} />
        </div>
    );
}
