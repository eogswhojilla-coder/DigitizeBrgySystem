import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import Button from "@/app/_components/button";
import { useForm } from "react-hook-form";
import { create_positions_service } from "@/app/services/positions-service";
import Swal from "sweetalert2";
import { get_positions_thunk } from "@/app/redux/position-thunk";
import { useDispatch } from "react-redux";

// Modal Component
const AddPositionModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch(); // ✅ moved inside component

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            position: "",
            limit: "",
            description: "",
        },
    });

    const submitForm = async (data) => {
        try {
            // 1️⃣ Save position first
            await create_positions_service(data);

            // 2️⃣ Fetch latest positions
            await dispatch(get_positions_thunk());

            // 3️⃣ Show success alert
            await Swal.fire({
                icon: "success",
                title: "Position saved successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            reset();
            onClose();
        } catch (error) {
            console.error("Error saving position:", error);
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Please try again later",
            });
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <form onSubmit={handleSubmit(submitForm)} className="max-w-7xl mx-auto">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Add New Position
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4">
                        {/* Position Field */}
                        <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("position", { required: "Position is required" })}
                                type="text"
                                id="position"
                                className={`w-full px-3 py-2 border ${
                                    errors.position ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter position title"
                            />
                            {errors.position && (
                                <p className="text-sm text-red-500 mt-1">{errors.position.message}</p>
                            )}
                        </div>

                        {/* Limit Field */}
                        <div>
                            <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
                                Limit <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("limit", {
                                    required: "Limit is required",
                                    min: { value: 1, message: "Minimum value is 1" },
                                })}
                                type="number"
                                id="limit"
                                className={`w-full px-3 py-2 border ${
                                    errors.limit ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter position limit"
                                min="1"
                            />
                            {errors.limit && (
                                <p className="text-sm text-red-500 mt-1">{errors.limit.message}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                id="description"
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Enter position description (optional)"
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 mt-6 pt-4 border-t p-6">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center space-x-2"
                        >
                            <span className="text-lg">+</span>
                            <span>{isSubmitting ? "Saving..." : "Save Position"}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Component
export default function AddPositionSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-end items-center">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 py-2 px-4 rounded-md"
                    variant="primary"
                >
                    <Plus size={16} />
                    ADD POSITION
                </Button>
            </div>

            <AddPositionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
