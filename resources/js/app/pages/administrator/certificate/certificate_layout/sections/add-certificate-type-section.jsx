import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Input from '@/app/_components/input';
import Button from '@/app/_components/button';
import { create_certificate_type_service } from '@/app/services/certificate-type-service';

const AddCertificateTypeModal = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            fee: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            await create_certificate_type_service({
                ...data,
                fee: parseFloat(data.fee)
            });

            await Swal.fire({
                icon: 'success',
                title: 'Certificate Type Added',
                text: 'The certificate type has been added successfully.',
                showConfirmButton: false,
                timer: 1500
            });

            reset();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join('\\n')
                : 'Failed to add certificate type. Please try again.';

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fee *
                            </label>
                            <input
                                {...register("fee", { 
                                    required: "Fee is required",
                                    min: {
                                        value: 0,
                                        message: "Fee cannot be negative"
                                    }
                                })}
                                type="number"
                                step="0.01"
                                min="0"
                                className={`w-full px-3 py-2 border ${
                                    errors.fee ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter certificate fee"
                            />
                            {errors.fee && (
                                <p className="text-sm text-red-500 mt-1">{errors.fee.message}</p>
                            )}
                        </div>
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