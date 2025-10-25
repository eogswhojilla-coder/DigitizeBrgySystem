import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Table from "@/app/_components/table";
import Button from "@/app/_components/button";
import { useForm } from "react-hook-form";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import axios from "axios";

export default function CertificateTypeSection() {
    const [types, setTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Fetch certificate types on component mount
    useEffect(() => {
        fetchCertificateTypes();
    }, []);

    const fetchCertificateTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/certificate-types");
            setTypes(response.data);
        } catch (error) {
            console.error("Error fetching certificate types:", error);
        } finally {
            setIsLoading(false);
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
            header: "Fee",
            accessor: "fee",
            cell: (row) =>
                row?.fee ? `₱${parseFloat(row.fee).toFixed(2)}` : "₱0.00",
        },
    ];

    const onSubmit = async (data) => {
        try {
            await axios.post("/api/certificate-types", data);
            await fetchCertificateTypes();
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error("Error creating certificate type:", error);
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
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
                <h2 className="text-lg font-semibold">Certificate Types</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Type
                </Button>
            </div>

            <Table
                columns={columns}
                data={types}
                emptyMessage="No certificate types found"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                }}
                title="Add Certificate Type"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Name"
                        {...register("name", { required: "Name is required" })}
                        error={errors?.name?.message}
                    />
                    <Input
                        label="Description"
                        {...register("description")}
                        error={errors?.description?.message}
                    />
                    <Input
                        label="Fee"
                        type="number"
                        step="0.01"
                        {...register("fee", {
                            required: "Fee is required",
                            min: { value: 0, message: "Fee must be positive" },
                        })}
                        error={errors?.fee?.message}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsModalOpen(false);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
