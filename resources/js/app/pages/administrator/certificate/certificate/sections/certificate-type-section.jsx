import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Table from "@/app/_components/table";
import Button from "@/app/_components/button";
import { useForm } from "react-hook-form";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import axios from "axios";
import Swal from "sweetalert2";

export default function CertificateTypeSection() {
    const [types, setTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const hasFee = watch("has_fee", false);

    // Fetch certificate types on component mount
    useEffect(() => {
        fetchCertificateTypes();
    }, []);

    const fetchCertificateTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/certificate-types");
            // Ensure data is always an array
            const data = response.data.data || response.data;
            setTypes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching certificate types:", error);
            setTypes([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

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

    const openAddModal = () => {
        setEditingType(null);
        setQrPreview(null);
        reset({
            name: "",
            description: "",
            has_fee: false,
            fee: "",
            gcash_qr: null
        });
        setIsModalOpen(true);
    };

    const openEditModal = (type) => {
        setEditingType(type);
        setQrPreview(type.gcash_qr_url || null);
        reset({
            name: type.name,
            description: type.description,
            has_fee: type.has_fee || false,
            fee: type.fee || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This certificate type will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/certificate-types/${id}`);
                await fetchCertificateTypes();
                Swal.fire("Deleted!", "Certificate type has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting certificate type:", error);
                Swal.fire("Error!", error.response?.data?.message || "Failed to delete certificate type.", "error");
            }
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
            cell: (row) => row?.name || "N/A",
        },
        {
            header: "Description",
            accessor: "description",
            cell: (row) => row?.description || "N/A",
        },
        {
            header: "Has Fee",
            accessor: "has_fee",
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row?.has_fee ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                    {row?.has_fee ? "Yes" : "No"}
                </span>
            ),
        },
        {
            header: "Fee",
            accessor: "fee",
            cell: (row) =>
                row?.has_fee && row?.fee ? `₱${parseFloat(row.fee).toFixed(2)}` : "-",
        },
        {
            header: "Actions",
            accessor: "actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openEditModal(row)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

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

            if (editingType) {
                // Update existing type
                await axios.post(`/api/certificate-types/${editingType.id}`, formData, {
                    params: { _method: 'PUT' }
                });
                Swal.fire("Updated!", "Certificate type has been updated.", "success");
            } else {
                // Create new type
                await axios.post("/api/certificate-types", formData);
                Swal.fire("Created!", "Certificate type has been created.", "success");
            }

            await fetchCertificateTypes();
            setIsModalOpen(false);
            reset();
            setQrPreview(null);
        } catch (error) {
            console.error("Error saving certificate type:", error);
            Swal.fire("Error!", error.response?.data?.message || "Failed to save certificate type.", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="text-lg font-semibold">Certificate Types</h2>
                <Button onClick={openAddModal}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Type
                </Button>
            </div>

            <Table
                columns={columns}
                data={Array.isArray(types) ? types : []}
                emptyMessage="No certificate types found"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                    setQrPreview(null);
                    setEditingType(null);
                }}
                title={editingType ? "Edit Certificate Type" : "Add Certificate Type"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Name"
                        {...register("name", { required: "Name is required" })}
                        error={errors?.name?.message}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
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
                                    GCash QR Code {!editingType && '*'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    {...register("gcash_qr", {
                                        required: hasFee && !editingType ? "QR code is required" : false,
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
                                    {editingType?.gcash_qr ? 'Upload a new file to replace the existing QR code' : 'Accepted formats: JPG, JPEG, PNG (Max 2MB)'}
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

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsModalOpen(false);
                                reset();
                                setQrPreview(null);
                                setEditingType(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingType ? "Update" : "Save"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
