import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Input from '@/app/_components/input';
import Button from '@/app/_components/button';
import axios from 'axios';

const AddCertificateTypeModal = ({ isOpen, onClose }) => {
    const [qrPreview, setQrPreview] = useState(null);
    
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            has_fee: false,
            fee: '',
            gcash_qr: null
        }
    });

    const hasFee = watch("has_fee", false);

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

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            
            // Append text fields
            formData.append('name', data.name);
            if (data.description) formData.append('description', data.description);
            
            // Handle has_fee conversion
            formData.append('has_fee', data.has_fee ? '1' : '0');
            
            // Handle fee-related fields
            if (data.has_fee) {
                if (data.fee) {
                    formData.append('fee', data.fee);
                }
                
                if (data.gcash_qr && data.gcash_qr.length > 0) {
                    formData.append('gcash_qr', data.gcash_qr[0]);
                }
            }

            await axios.post("/api/certificate-types", formData);

            await Swal.fire({
                icon: 'success',
                title: 'Certificate Type Added',
                text: 'The certificate type has been added successfully.',
                showConfirmButton: false,
                timer: 1500
            });

            reset();
            setQrPreview(null);
            onClose();
            
            // Reload the page to refresh the list
            window.location.reload();
        } catch (error) {
            const errorMessage = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join('\n')
                : error.response?.data?.message || 'Failed to add certificate type. Please try again.';

            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Add Certificate Type
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                {...register("name", { 
                                    required: "Certificate type name is required" 
                                })}
                                type="text"
                                className={`w-full px-3 py-2 border ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter certificate type name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter certificate type description"
                            />
                        </div>

                        {/* Has Fee Toggle */}
                        <div className="border-t pt-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">This certificate requires a fee</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...register("has_fee")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                        </div>

                        {/* Fee Fields - Show only when has_fee is true */}
                        {hasFee && (
                            <div className="space-y-4 animate-fadeIn border border-blue-100 rounded-lg p-4 bg-blue-50">
                                {/* Fee Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fee Amount (₱) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...register("fee", {
                                            required: hasFee ? "Fee is required" : false,
                                            min: { value: 0, message: "Fee must be 0 or greater" }
                                        })}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.fee ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.fee && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.fee.message}
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
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.gcash_qr ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.gcash_qr && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.gcash_qr.message}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Accepted formats: JPG, JPEG, PNG (Max 2MB)
                                    </p>
                                </div>

                                {/* QR Preview */}
                                {qrPreview && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            QR Code Preview
                                        </label>
                                        <div className="border rounded-lg p-4 bg-white">
                                            <img
                                                src={qrPreview}
                                                alt="QR Code Preview"
                                                className="w-48 h-48 object-contain mx-auto"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Add Certificate Type
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function AddCertificateTypeSection() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Add Certificate Type
            </Button>

            <AddCertificateTypeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}