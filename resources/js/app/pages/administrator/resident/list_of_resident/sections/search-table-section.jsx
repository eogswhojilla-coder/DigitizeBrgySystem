import Button from "@/app/_components/button";
import Input from "@/app/_components/Input";
import React, { useState } from "react";

export default function SearchTableSection() {
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
    return (
        <div>
            <div className="flex items-center mb-4">
                <span className="text-gray-700 font-semibold text-lg">
                    NUMBER OF RESIDENCE
                </span>
                <span className="ml-2 bg-blue-600 text-white px-3 py-1 rounded font-medium">
                    8
                </span>
            </div>

            {/* Filter Form */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {/* First Row */}
                <div>
                    <label>First Name</label>
                    <Input
                        type="text"
                        value={filters.firstName}
                        onChange={(e) =>
                            handleFilterChange("firstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter first name"
                    />
                </div>
                <div>
                    <label>Middle Name</label>
                    <Input
                        type="text"
                        value={filters.middleName}
                        onChange={(e) =>
                            handleFilterChange("middleName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter middle name"
                    />
                </div>
                <div>
                    <label>Last Name</label>
                    <Input
                        type="text"
                        value={filters.lastName}
                        onChange={(e) =>
                            handleFilterChange("lastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter last name"
                    />
                </div>

                <div>
                    <label>Resident Number</label>
                    <Input
                        type="text"
                        value={filters.residentNumber}
                        onChange={(e) =>
                            handleFilterChange("residentNumber", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter resident number"
                    />
                </div>
                <div>
                    <label>Age</label>
                    <Input
                        type="number"
                        value={filters.age}
                        onChange={(e) =>
                            handleFilterChange("age", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter age"
                    />
                </div>

                {/* Second Row */}
                <div>
                    <label>__</label>
                    <select
                        value={filters.voters}
                        onChange={(e) =>
                            handleFilterChange("voters", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">---SELECT VOTERS---</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>

                <div>
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">---SELECT STATUS---</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </div>

                {/* Third Row */}
                <div>
                    <select
                        value={filters.pwd}
                        onChange={(e) =>
                            handleFilterChange("pwd", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">---SELECT PWD---</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>
                <div>
                    <select
                        value={filters.singleParent}
                        onChange={(e) =>
                            handleFilterChange("singleParent", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">---SELECT PARENT STATUS---</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>
                <div>
                    <select
                        value={filters.senior}
                        onChange={(e) =>
                            handleFilterChange("senior", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">---SELECT SENIOR---</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>

                {/* Fourth Row */}
            </div>
        </div>
    );
}
