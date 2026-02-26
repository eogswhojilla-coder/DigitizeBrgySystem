import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState } from "react";

export default function NewResidentLayout({ children, register, errors }) {
    const [imagePreview, setImagePreview] = useState(null);

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
        const input = document.getElementById("profileImage");
        if (input) {
            input.value = "";
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
                                <span className="text-xs text-gray-500">
                                    Upload Photo
                                </span>
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
                        {imagePreview
                            ? "Click × to remove image"
                            : "Click to upload profile picture"}
                    </p>
                </div>

                <div className="space-y-2">
                    <Select
                        register={register("voters", {
                            required: "Field is required",
                        })}
                        error={errors?.voters?.message}
                        name="voters"
                        label="Voters Status"
                        options={[
                            { value: "", label: "Select Status" },
                            { value: "YES", label: "Registered" },
                            { value: "NO", label: "Unregistered" },
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
                    <Select
                        register={register("pwd", {
                            required: "Field is required",
                        })}
                        error={errors?.pwd?.message}
                        name="pwd"
                        label="PWD"
                        options={[
                            { value: "", label: "Select Status" },
                            { value: "YES", label: "Yes" },
                            { value: "NO", label: "No" },
                        ]}
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
                            { value: "YES", label: "Yes" },
                            { value: "NO", label: "No" },
                        ]}
                    />
                </div>
            </div>
            {children}
        </>
    );
}
