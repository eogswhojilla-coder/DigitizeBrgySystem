import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState } from "react";

export default function NewResidentLayout({ children, register, errors }) {
    const [isOfficial, setIsOfficial] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        const input = document.getElementById('profileImage');
        if (input) {
            input.value = '';
        }
    };

    return (
        <>
            <div className="lg:col-span-1 space-y-6  ">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="profileImage"
                                className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
                            >
                                <svg
                                    className="w-8 h-8 text-gray-400 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span className="text-xs text-gray-500">Upload Photo</span>
                            </label>
                        )}
                        <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            {...register("profileImage")}
                        />
                    </div>
                    <p className="text-xs text-center text-gray-500">
                        {imagePreview ? "Click × to remove image" : "Click to upload profile picture"}
                    </p>
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
