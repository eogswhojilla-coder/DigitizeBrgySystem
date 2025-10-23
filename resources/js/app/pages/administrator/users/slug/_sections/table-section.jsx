import Table from "@/app/_components/table";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { accounts } = useSelector((store) => store.accounts);
    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Location", accessor: "location" },
        { header: "Position", accessor: "position" },
        { header: "Action", accessor: "action" },
    ];

    return (
        <>
            <Table
                columns={columns}
                data={accounts?.data?.map((res) => ({
                    name: res?.name ?? "NONE",
                    email: res?.email,
                    location: res?.location,
                    position: res?.position ?? "NONE",
                    action: <>Procceed</>,
                }))}
            />
        </>
    );
}
