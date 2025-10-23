import React, { useState } from "react";
import Layout from "../../layout";

import {
  Search,
  RotateCcw,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Input from "@/app/_components/input";
import Button from "@/app/_components/button";
import SearchResidentUserSection from "./sections/search-resident-user-section";
import TableResidentUserSection from "./sections/table-resident-user-section";
import PaginationResidentUserSection from "./sections/pagination-resident-user-section";

const UserManagementTable = () => {
  const [searchData, setSearchData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    residentNumber: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    {
      id: 3,
      residentNumber: "30891782437227",
      name: "Aj S. Jan",
      username: "jan123123",
      password: "janjan123",
      image: null,
    },
    {
      id: 4,
      residentNumber: "3375642249394S",
      name: "Wacky D. Hojilla",
      username: "wacky123",
      password: "wacky123",
      image: "/api/placeholder/40/40",
    },
    {
      id: 5,
      residentNumber: "225326332918091",
      name: "Wacky D. Hojilla",
      username: "wacky12345",
      password: "wacky123",
      image: "/api/placeholder/40/40",
    },
    {
      id: 6,
      residentNumber: "1135321697712l",
      name: "Ayesha M. Dela",
      username: "yesha123",
      password: "wacky123",
      image: null,
    },
    {
      id: 7,
      residentNumber: "34978040768599",
      name: "Jancen P. Bacarro",
      username: "jancen123",
      password: "wacky123",
      image: "/api/placeholder/40/40",
    },
    {
      id: 8,
      residentNumber: "233704052111567",
      name: "Asdasd A. Asdasd",
      username: "wawaki123",
      password: "wacky123",
      image: null,
    },
  ];

  const totalRows = users.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log("Searching with:", searchData);
  };

  const handleReset = () => {
    setSearchData({
      firstName: "",
      middleName: "",
      lastName: "",
      residentNumber: "",
    });
  };

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <SearchResidentUserSection />

        {/* Table */}

        <TableResidentUserSection />
        {/* Pagination */}
       
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Layout>
      <UserManagementTable />
    </Layout>
  );
}
