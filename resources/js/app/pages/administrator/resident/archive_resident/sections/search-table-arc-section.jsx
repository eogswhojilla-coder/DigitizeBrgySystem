import Input from "@/app/_components/input";
import React, { useState } from "react";

export default function SearchTableArcSection() {
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
                    NUMBER OF ARCHIVE RESIDENCE
                </span>
                <span className="ml-2 bg-blue-600 text-white px-3 py-1 rounded font-medium">
                    0
                </span>
            </div>

            {/* Filter Form */}
            <div className="grid grid-cols-4 gap-4 mb-4">
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
                    <label>Midlle Name</label>
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
            </div>
        </div>
    );
}
