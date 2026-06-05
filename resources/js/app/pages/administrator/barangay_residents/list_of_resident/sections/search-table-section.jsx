import Button from "@/app/_components/button";
import Input from "@/app/_components/Input";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SearchTableSection({ onFilterChange }) {
    const { residents } = useSelector((store) => store.barangay_residents);
    const [filters, setFilters] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        voters: "",
        age: "",
        pwd: "",
        singleParent: "",
        senior: "",
        residentNumber: "",
    });

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);

        // Debounce the filter change
        if (window.filterTimeout) {
            clearTimeout(window.filterTimeout);
        }

        window.filterTimeout = setTimeout(() => {
            onFilterChange(newFilters);
        }, 500);
    };

    const totalResidents = residents?.total || residents?.data?.length || 0;

    return (
        <div>
            <div className="flex items-center mb-4">
                <span className="text-gray-700 font-semibold text-lg">
                    NUMBER OF RESIDENCE
                </span>
                <span className="ml-2 bg-blue-600 text-white px-3 py-1 rounded font-medium">
                    {totalResidents}
                </span>
            </div>

            {/* Filter Form */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {/* First Row */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        First Name
                    </label>
                    <Input
                        type="text"
                        value={filters.firstName}
                        onChange={(e) =>
                            handleFilterChange("firstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter first name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Middle Name
                    </label>
                    <Input
                        type="text"
                        value={filters.middleName}
                        onChange={(e) =>
                            handleFilterChange("middleName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter middle name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Last Name
                    </label>
                    <Input
                        type="text"
                        value={filters.lastName}
                        onChange={(e) =>
                            handleFilterChange("lastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter last name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Resident Number
                    </label>
                    <Input
                        type="text"
                        value={filters.residentNumber}
                        onChange={(e) =>
                            handleFilterChange("residentNumber", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter resident number"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <Input
                        type="number"
                        value={filters.age}
                        onChange={(e) =>
                            handleFilterChange("age", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter age"
                    />
                </div>

                {/* Second Row */}
                <div>
                    <label className="block text-sm font-medium mb-1">Voters</label>
                    <select
                        value={filters.voters}
                        onChange={(e) =>
                            handleFilterChange("voters", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">SELECT STATUS</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>

               
                {/* Third Row */}
                <div>
                    <label className="block text-sm font-medium mb-1">PWD</label>
                    <select
                        value={filters.pwd}
                        onChange={(e) =>
                            handleFilterChange("pwd", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">SELECT STATUS</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Single Parent
                    </label>
                    <select
                        value={filters.singleParent}
                        onChange={(e) =>
                            handleFilterChange("singleParent", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">SELECT STATUS</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Senior</label>
                    <select
                        value={filters.senior}
                        onChange={(e) =>
                            handleFilterChange("senior", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">SELECT STATUS</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
