import React from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
import ActionSection from "./action-section";
import DeleteSection from "./delete-section";

export default function TableSection1() {
  const { positions } = useSelector((store) => store.positions);

  // Define table columns
  const columns = [
    {
      header: "Position",
      accessor: "position",
    },
    {
      header: "Limit",
      accessor: "limit",
    },
    {
      header: "Action",
      accessor: "action",
    },
  ];

  // Transform positions data for the table
  const tableData = positions?.map((position) => ({
    position: <span className="font-medium">{position.position}</span>,
    limit: position.limit,
    action: (
      <div className="flex space-x-2">
        <ActionSection posId={position.id} />
        <DeleteSection data={position} />
      </div>
    ),
  })) || [];

  return (
    <div>
      {positions.length > 0 ? (
        <Table columns={columns} data={tableData} />
      ) : (
        <div className="px-6 py-8 text-center text-gray-500 bg-white border border-gray-300 rounded-lg">
          No positions found
        </div>
      )}
    </div>
  );
}
