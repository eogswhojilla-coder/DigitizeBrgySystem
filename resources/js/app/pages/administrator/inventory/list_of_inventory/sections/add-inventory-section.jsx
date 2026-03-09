import Button from "@/app/_components/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { create_inventories_service } from "../../../../../services/inventories-service";
import Swal from "sweetalert2";
import store from "@/app/store/store";
import { get_inventories_thunk } from "@/app/redux/inventories-thunk";

export default function AddInventorySection() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const [showForm, setShowForm] = useState(false);
    const [qrPreview, setQrPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const hasFee = watch("has_fee", false);

    const categories = [
        "Furniture",
        "Equipment",
        "Event Supplies",
        "Sports Equipment",
        "Office Supplies",
        "Medical Supplies",
        "Tools",
        "Electronics",
        "Other"
    ];

    const conditions = ["New", "Good", "Fair", "Poor"];
    const statuses = ["Active", "Damaged", "Retired"];

    const handleQrChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setQrPreview(null);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            
            // Append all text fields except special ones
            Object.keys(data).forEach(key => {
                if (key !== 'gcash_qr' && key !== 'has_fee' && key !== 'image' && data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });

            // Handle item image upload
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }
            
            // Convert has_fee to proper boolean value (1 or 0)
            formData.append('has_fee', data.has_fee ? '1' : '0');
            
            // Only append price and gcash_qr if has_fee is true
            if (data.has_fee) {
                if (typeof data.price !== 'undefined') {
                    formData.append('price', data.price);
                }
                if (data.gcash_qr && data.gcash_qr[0]) {
                    formData.append('gcash_qr', data.gcash_qr[0]);
                }
            }
            
            await create_inventories_service(formData);
            await store.dispatch(get_inventories_thunk());
            await Swal.fire({
                icon: "success",
                title: "Inventory item saved successfully",
                showConfirmButton: false,
                timer: 1500,
            });

            reset();
            setShowForm(false);
            setQrPreview(null);
            setImagePreview(null);
        } catch (error) {
            console.error("Error saving item:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to save item. Please try again.",
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
                <Button
                    onClick={() => setShowForm(true)}
                    variant="primary"
                    className="flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Inventory
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Add New Inventory Item
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Item Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Folding Chairs"
                                            {...register("name", {
                                                required: "Item name is required",
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.name ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            {...register("category", {
                                                required: "Category is required",
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.category ? "border-red-500" : "border-gray-300"
                                            }`}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.category.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        placeholder="Describe the item..."
                                        {...register("description", {
                                            required: "Description is required",
                                        })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.description ? "border-red-500" : "border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                required: "Quantity is required",
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Must be 0 or greater" }
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.quantity ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.quantity && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.quantity.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Minimum Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="5"
                                            defaultValue={5}
                                            {...register("minimum_quantity", {
                                                required: "Minimum quantity is required",
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Must be 0 or greater" }
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.minimum_quantity ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.minimum_quantity && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.minimum_quantity.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Borrowed */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Currently Borrowed
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            defaultValue={0}
                                            {...register("borrowed", {
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Must be 0 or greater" }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Condition */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Condition *
                                        </label>
                                        <select
                                            {...register("condition", {
                                                required: "Condition is required",
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.condition ? "border-red-500" : "border-gray-300"
                                            }`}
                                        >
                                            <option value="">Select condition</option>
                                            {conditions.map((condition) => (
                                                <option key={condition} value={condition}>
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

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            {...register("status", {
                                                required: "Status is required",
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.status ? "border-red-500" : "border-gray-300"
                                            }`}
                                        >
                                            <option value="">Select status</option>
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Storage Location *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Storage Room A"
                                            {...register("location", {
                                                required: "Location is required",
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.location ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {errors.location && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.location.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Damaged */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Damaged Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            defaultValue={0}
                                            {...register("damaged", {
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Must be 0 or greater" }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Borrowing Fee Section */}
                                <div className="border-t pt-4 space-y-4">
                                    {/* Item Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            {...register("image")}
                                            onChange={handleImageChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Upload a photo of the item (max 5MB)</p>
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Item Preview"
                                                    className="max-w-xs max-h-48 rounded-lg shadow-sm border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Borrowing Fee Section */}
                                <div className="border-t pt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Has Borrowing Fee?
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                {...register("has_fee")}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {hasFee && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                                            {/* Price Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Borrowing Fee (₱) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    {...register("price", {
                                                        required: hasFee ? "Price is required" : false,
                                                        valueAsNumber: true,
                                                        min: { value: 0, message: "Price must be 0 or greater" }
                                                    })}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                        errors.price ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.price && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.price.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* GCash QR Upload */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    GCash QR Code *
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png"
                                                    {...register("gcash_qr", {
                                                        required: hasFee ? "QR code is required" : false,
                                                    })}
                                                    onChange={handleQrChange}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                        errors.gcash_qr ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.gcash_qr && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.gcash_qr.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* QR Preview */}
                                            {qrPreview && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        QR Code Preview
                                                    </label>
                                                    <div className="border rounded-lg p-4 bg-gray-50">
                                                        <img
                                                            src={qrPreview}
                                                            alt="QR Code Preview"
                                                            className="max-w-xs mx-auto rounded-lg shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex space-x-3 pt-4 border-t">
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2 font-medium"
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
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
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
