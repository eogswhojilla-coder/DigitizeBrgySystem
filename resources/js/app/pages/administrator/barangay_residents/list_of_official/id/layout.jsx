import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState } from "react";

export default function NewOfficialLayout({ children, register, errors }) {
    const [isOfficial, setIsOfficial] = useState(false);
    const [formData, setFormData] = useState({
        // Basic Info
        position: "",
        startDate: "",
        endDate: "",
        voters: "",
        dateOfBirth: "",
        placeOfBirth: "",
        pwd: "",
        singleParent: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        gender: "Male",
        civilStatus: "Single",
        religion: "",
        nationality: "",
        // Other Info (Address)
        municipality: "",
        zip: "",
        barangay: "",
        houseNumber: "",
        street: "",
        address: "",
        contactNumber: "",
        emailAddress: "",
        // Guardian
        fatherName: "",
        motherName: "",
        guardianName: "",
        guardianContact: "",
        // Account
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <>
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center border border-gray-200">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center mb-4">
                    <input
                        onChange={() => setIsOfficial(!isOfficial)}
                        id="default-checkbox"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 "
                    />
                    <label
                        for="default-checkbox"
                        class="ms-2 text-sm font-medium text-gray-900 "
                    >
                        Is Official
                    </label>
                </div>
                {isOfficial && (
                    <div className="flex gap-3">
                        <div className="space-y-2">
                            <Select
                                register={register("position", {
                                    required: "Field is required",
                                })}
                                name="position"
                                label="Position"
                                error={errors?.position?.message}
                                options={[
                                    {
                                        value: "barangay-captain",
                                        label: "Barangay Captain",
                                    },
                                    {
                                        value: "barangay-kagawad",
                                        label: "Barangay Kagawad",
                                    },
                                    {
                                        value: "barangay-sk-chairman",
                                        label: "Barangay SK Chairman",
                                    },
                                    {
                                        value: "barangay-sk-kagawad",
                                        label: "Barangay SK Kagawad",
                                    },
                                    {
                                        value: "barangay-secretary",
                                        label: "Barangay Secretary",
                                    },
                                    {
                                        value: "barangay-staff",
                                        label: "Barangay Staff",
                                    },
                                    {
                                        value: "barangay-security-personnel",
                                        label: "Barangay Security Personnel",
                                    },
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    register={register("startDate", {
                                        required: "Field is required",
                                    })}
                                    error={errors?.startDate?.message}
                                    label="Start"
                                    placeholder="Start date"
                                    type="date"
                                    name="startDate"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    register={register("endDate", {
                                        required: "Field is required",
                                    })}
                                    error={errors?.endDate?.message}
                                    label="End"
                                    placeholder="End date"
                                    type="date"
                                    name="endDate"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Select
                        register={register("voters", {
                            required: "Field is required",
                        })}
                        error={errors?.voters?.message}
                        name="voters"
                        label="Voters Status"
                        value={formData.voters}
                        onChange={handleInputChange}
                        options={[
                            { value: "registered", label: "Registered" },
                            { value: "unregistered", label: "Unregistered" },
                        ]}
                    />
                </div>
                <div className="space-y-2">
                    <Input
                        register={register("dateOfBirth", {
                            required: "Field is required",
                        })}
                        error={errors?.dateOfBirth?.message}
                        type="date"
                        name="dateOfBirth"
                        label="Date of Birth"
                    />
                </div>

                <div className="w-full">
                    <Input
                        register={register("placeOfBirth", {
                            required: "Field is required",
                        })}
                        error={errors?.placeOfBirth?.message}
                        label="Place of Birth"
                        placeholder="Enter Place of Birth"
                        type="text"
                        name="placeOfBirth"
                    />
                </div>

                <div className="w-full">
                    <Input
                        register={register("pwd", {
                            required: "Field is required",
                        })}
                        error={errors?.pwd?.message}
                        label="PWD"
                        placeholder="Enter PWD"
                        type="text"
                        name="pwd"
                    />
                </div>
                <div className="space-y-2">
                    <Select
                        register={register("singleParent", {
                            required: "Field is required",
                        })}
                        error={errors?.singleParent?.message}
                        name="singleParent"
                        label="Single Parent"
                        options={[
                            { value: "", label: "Select Status" },
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                        ]}
                    />
                </div>
            </div>
            {children}
        </>
    );
}
