import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import { RotateCcw, Search } from "lucide-react";
import React, { useState } from "react";

export default function SearchResidentUserSection() {
    const [searchData, setSearchData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        residentNumber: "",
    });

    const handleReset = () => {
        setSearchData({
            firstName: "",
            middleName: "",
            lastName: "",
            residentNumber: "",
        });
    };

    const handleSearch = () => {
        console.log("Searching with:", searchData);
    };

    const handleInputChange = (field, value) => {
        setSearchData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="text-black p-6">
            <h2 className="text-xl font-semibold mb-6">
                NUMBER OF USERS RESIDENT
            </h2>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">FIRST NAME</label>
                    <Input
                        name="firstName"
                        value={searchData.firstName}
                        onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                        }
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">MIDDLE NAME</label>
                    <Input
                        name="middleName"
                        value={searchData.middleName}
                        onChange={(e) =>
                            handleInputChange("middleName", e.target.value)
                        }
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">LAST NAME</label>
                    <Input
                        name="lastName"
                        value={searchData.lastName}
                        onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                        }
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">RESIDENT NUMBER</label>
                    <Input
                        name="residentNumber"
                        value={searchData.residentNumber}
                        onChange={(e) =>
                            handleInputChange("residentNumber", e.target.value)
                        }
                        className="w-full"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <Button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                >
                    <Search size={16} />
                    SEARCH
                </Button>
                <Button
                    variant="danger"
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                >
                    <RotateCcw size={16} />
                    RESET
                </Button>
            </div>
        </div>
    );
}
