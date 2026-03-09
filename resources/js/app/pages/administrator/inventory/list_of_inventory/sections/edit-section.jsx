import Button from "@/app/_components/button";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, X } from "lucide-react";
import { update_inventories_service } from "../../../../../services/inventories-service";
import Swal from "sweetalert2";
import store from "@/app/store/store";
import { get_inventories_thunk } from "@/app/redux/inventories-thunk";

export default function EditSection({ item, onClose }) {
    const [qrPreview, setQrPreview] = useState(item?.gcash_qr_url || null);
    const [imagePreview, setImagePreview] = useState(item?.image || null);
    
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: item.name,
            category: item.category,
            description: item.description,
            quantity: item.quantity,
            minimum_quantity: item.minimum_quantity || 5,
            borrowed: item.borrowed || 0,
            damaged: item.damaged || 0,
            condition: item.condition,
            status: item.status,
            location: item.location,
            has_fee: item.has_fee || false,
            price: item.price || '',
        }
    });

    const hasFee = watch("has_fee", item.has_fee || false);

    const handleQrChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrPreview(reader.result);
            };
            reader.readAsDataURL(file);
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
        }
    };

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

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            
            // Append non-fee fields
            const fieldsToAppend = [
                'name', 'category', 'description', 'quantity', 
                'minimum_quantity', 'borrowed', 'damaged', 
                'condition', 'status', 'location'
            ];
            
            fieldsToAppend.forEach(field => {
                if (data[field] !== undefined && data[field] !== null) {
                    formData.append(field, data[field]);
                }
            });
            
            // Handle item image upload
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }
            
            // Handle has_fee conversion
            formData.append('has_fee', data.has_fee ? '1' : '0');
            
            // Handle fee-related fields
            if (data.has_fee) {
                if (data.price) {
                    formData.append('price', data.price);
                }
                
                if (data.gcash_qr && data.gcash_qr.length > 0) {
                    formData.append('gcash_qr', data.gcash_qr[0]);
                }
            }
            
            await update_inventories_service(item.id, formData);
            await store.dispatch(get_inventories_thunk());
            await Swal.fire({
                icon: "success",
                title: "Inventory updated successfully",
                showConfirmButton: false,
                timer: 1500,
            });
            onClose();
        } catch (error) {
            console.error("Error updating item:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update item. Please try again.",
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Edit Inventory Item
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Item Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
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
                                    {...register("quantity", {
                                        required: "Quantity is required",
                                        valueAsNumber: true,
                                    })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                        errors.quantity ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                            </div>

                            {/* Minimum Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("minimum_quantity", {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Borrowed */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Borrowed
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("borrowed", {
                                        valueAsNumber: true,
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {conditions.map((condition) => (
                                        <option key={condition} value={condition}>
                                            {condition}
                                        </option>
                                    ))}
                                </select>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    {...register("location", {
                                        required: "Location is required",
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Damaged */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Damaged Quantity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("damaged", {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Borrowing Fee Section */}
                        <div className="border-t pt-4 mt-4">
                            {/* Item Image Upload */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Image
                                </label>
                                {imagePreview && (
                                    <div className="mb-2">
                                        <img
                                            src={imagePreview}
                                            alt="Item"
                                            className="max-w-xs max-h-48 rounded-lg shadow-sm border"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    {...register("image")}
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Upload a new photo to replace (max 5MB)</p>
                            </div>
                        </div>

                        {/* Borrowing Fee Section */}
                        <div className="border-t pt-4 mt-4">
                            <div className="mb-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700">
                                        Has Borrowing Fee?
                                    </span>
                                    <div className="relative inline-block">
                                        <input
                                            type="checkbox"
                                            {...register("has_fee")}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 transition-all"></div>
                                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                </label>
                            </div>

                            {hasFee && (
                                <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                                    {/* Borrowing Fee Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Borrowing Fee (₱) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...register("price", {
                                                required: hasFee ? "Price is required when fee is enabled" : false,
                                                valueAsNumber: false,
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.price ? "border-red-500" : "border-gray-300"
                                            }`}
                                            placeholder="0.00"
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
                                            GCash QR Code {!item.gcash_qr && '*'}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png"
                                            {...register("gcash_qr", {
                                                required: hasFee && !item.gcash_qr ? "QR code is required when fee is enabled" : false
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
                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.gcash_qr ? 'Upload a new file to replace the existing QR code' : 'Accepted formats: JPG, JPEG, PNG (Max 2MB)'}
                                        </p>
                                        
                                        {/* QR Preview */}
                                        {qrPreview && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    {item.gcash_qr ? 'Current/New QR Code:' : 'Preview:'}
                                                </p>
                                                <img
                                                    src={qrPreview}
                                                    alt="QR Code Preview"
                                                    className="w-48 h-48 object-contain border-2 border-gray-200 rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>
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
                                    "Updating..."
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        <span>Update Item</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
