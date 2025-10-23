import Button from "@/app/_components/button";
import { get_administrator_thunk } from "@/app/redux/administrator-thunk";
import { create_administrator_service } from "@/app/services/administrator-service";
import store from "@/app/store/store";
import { Camera, Plus, Users, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export default function ButtonAdministratorUserSection() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            password: "",
            contactNumber: "",
        },
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage(null);
        reset();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
   
    const onSubmit = async (data) => {
        try {
            await create_administrator_service(data);
            await store.dispatch(get_administrator_thunk());
            await Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            handleCloseModal(); // Close modal after successful submission
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to save administrator",
            });
        }
    };

    return (
        <>
            <div className="mb-3 flex justify-end">
                <Button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors justify-end"
                >
                    <Users size={20} />
                    NEW ADMINISTRATOR
                </Button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        {/* Modal Header */}
                        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                Administrator
                            </h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Profile Image */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300 overflow-hidden">
                                        {selectedImage ? (
                                            <img
                                                src={selectedImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Users
                                                size={32}
                                                className="text-blue-600"
                                            />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            document
                                                .getElementById("imageUpload")
                                                .click()
                                        }
                                        className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
                                    >
                                        <Camera size={14} />
                                    </button>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    {...register("firstName", {
                                        required: "Field is required",
                                    })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter first name"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Middle Name
                                </label>
                                <input
                                    {...register("middleName", {
                                        required: "Field is required",
                                    })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter middle name"
                                />
                                {errors.middleName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.middleName.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    {...register("lastName", {
                                        required: "Field is required",
                                    })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter last name"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    {...register("username", {
                                        required: "Field is required",
                                    })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter username"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    {...register("password", {
                                        required: "Field is required",
                                    })}
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter password"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    {...register("contactNumber", {
                                        required: "Field is required",
                                    })}
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter contact number"
                                />
                                {errors.contactNumber && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.contactNumber.message}
                                    </p>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <X size={16} />
                                    CLOSE
                                </button>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Plus size={16} />
                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Administrator"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
