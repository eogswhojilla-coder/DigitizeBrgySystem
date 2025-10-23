import React from "react";
import { Edit } from "lucide-react";
import Table from "@/app/_components/table";

export default function TableResidentUserSection() {
    const DefaultUserIcon = () => (
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
                className="w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );

    const users = [
        {
            id: 1,
            residentNumber: "23934/24033864",
            name: "Pa P. Pa",
            username: "wacky123456",
            password: "wacky123",
            image: null,
        },
        {
            id: 2,
            residentNumber: "1648321043900",
            name: "Christine F. Maquilang",
            username: "1648321043900",
            password: "04262025131430138",
            image: null,
        },
     
    ];

    // Define table columns
    const columns = [
        {
            header: "Image",
            accessor: "image",
        },
        {
            header: "Resident Number",
            accessor: "residentNumber",
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

    // Transform users data for the table
    const tableData = users.map((user) => ({
        image: user.image ? (
            <img
                src={user.image}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                    e.currentTarget.replaceWith(
                        Object.assign(document.createElement("div"), {
                            innerHTML: DefaultUserIcon().props.children,
                        })
                    );
                }}
            />
        ) : (
            <DefaultUserIcon />
        ),
        residentNumber: user.residentNumber,
        name: user.name,
        username: user.username,
        password: user.password,
        action: (
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <Edit size={18} />
            </button>
        ),
    }));

    return <Table columns={columns} data={tableData} />;
}
