import Button from "@/app/_components/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { create_inventories_service } from "../../../../../services/inventories-service";
// ✅ import real service
import Swal from "sweetalert2"; // ✅ import real Swal
import store from "@/app/store/store";
import { get_inventories_thunk } from "@/app/redux/inventories-thunk";

export default function AddInventorySection() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }, // ✅ fix here
    } = useForm();

    const [items, setItems] = useState([
        {
            id: 1,
            name: "Shovel",
            description: "Heavy-duty garden shovel for digging",
            quantity: 5,
            condition: "Good",
            location: "Tool Shed A",
            status: "Active",
            dateAdded: "2024-01-15",
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const conditions = ["New", "Good", "Fair", "Poor"];
    const statuses = ["Active", "Damaged", "Retired"];

    const onSubmit = async (data) => {
        try {
            await create_inventories_service(data); // ✅ will now call Laravel API
            await store.dispatch(get_inventories_thunk());
            await Swal.fire({
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });

            const newItem = {
                id: items.length + 1,
                ...data,
                dateAdded: new Date().toISOString().split("T")[0],
            };

            setItems([...items, newItem]);
            reset();
            setShowForm(false);
        } catch (error) {
            console.error("Error saving item:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save item. Please try again.",
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto ">
            <div className="flex justify-end mb-4">
                <Button
                    onClick={() => {
                        setShowForm(true);
                        setEditingItem(null);
                    }}
                    variant="primary"
                    className="flex items-center gap-2 "
                >
                    <Plus className="w-5 h-5" />
                    Add Inventory
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingItem ? "Edit Item" : "Add New Item"}
                            </h2>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                {/* Item Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Shovel"
                                        {...register("name", {
                                            required: "Field is required",
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        placeholder="Describe the item..."
                                        {...register("description", {
                                            required: "Field is required",
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.description
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        {...register("quantity", {
                                            required: "Field is required",
                                            valueAsNumber: true,
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.quantity
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.quantity && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.quantity.message}
                                        </p>
                                    )}
                                </div>

                                {/* Condition */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Condition *
                                    </label>
                                    <select
                                        {...register("condition", {
                                            required: "Field is required",
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.condition
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {conditions.map((condition) => (
                                            <option
                                                key={condition}
                                                value={condition}
                                            >
                                                {condition}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.condition && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.condition.message}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Storage Location *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Tool Shed A"
                                        {...register("location", {
                                            required: "Field is required",
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.location
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.location && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.location.message}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        {...register("status", {
                                            required: "Field is required",
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.status
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.status.message}
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            "Saving..."
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5" />
                                                <span>Save Item</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setShowForm(false);
                                            setEditingItem(null);
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
