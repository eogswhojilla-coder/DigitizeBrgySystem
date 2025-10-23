import React, { useState } from "react";
import { Edit2, X, Search, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";
import moment from "moment";
import DeleteSection from "./delete-section";
import Table from "@/app/_components/table";

export default function TableListResident() {
  const { residents } = useSelector((store) => store.barangay_residents);
  const [filters, setFilters] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    voters: "",
    age: "",
    status: "",
    pwd: "",
    singleParent: "",
    senior: "",
    residentNumber: "",
  });

  console.log("residents", residents);

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
      header: "Age",
      accessor: "age",
    },
    {
      header: "PWD",
      accessor: "pwd",
    },
    {
      header: "Single Parent",
      accessor: "singleParent",
    },
    {
      header: "Voters",
      accessor: "voters",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Action",
      accessor: "action",
    },
  ];

  // Transform residents data for the table
  const tableData = residents?.data?.map((resident) => {
    const dob = resident.dateOfBirth;
    const age = moment().diff(moment(dob, "YYYY-MM-DD"), "years");

    return {
      image: (
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-xs">IMG</span>
        </div>
      ),
      residentNumber: <span className="font-mono">N/A</span>,
      name: (
        <span className="font-medium">
          {resident.firstName} {resident.middleName} {resident.lastName}
        </span>
      ),
      age: age || "-",
      pwd: (
        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          {resident.pwd}
        </span>
      ),
      singleParent: (
        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          {resident.singleParent}
        </span>
      ),
      voters: (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            resident.voters === "YES"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {resident.voters}
        </span>
      ),
      status: (
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>{resident.status}</span>
        </div>
      ),
      action: (
        <div className="flex space-x-2">
          <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <DeleteSection data={resident} />
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