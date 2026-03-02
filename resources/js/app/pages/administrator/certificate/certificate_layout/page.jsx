import React, { useState, useEffect } from "react";
import Layout from "../../layout";
import { Plus, Printer, X, Download, Search } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCertificateTypes,
    createCertificateType,
} from "@/app/redux/certificate-type-thunk";
import Table from "@/app/_components/table";
import Modal from "@/app/_components/modal";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Page() {
    const dispatch = useDispatch();
    const { certificateTypes, loading, error } = useSelector(
        (state) => state.certificateTypes,
    );
    const [showModal, setShowModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);

    // Resident search
    const [residents, setResidents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showResidentDropdown, setShowResidentDropdown] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    // Form for Add Certificate Type modal
    const {
        register,
        handleSubmit: handleFormSubmit,
        reset,
        watch,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            has_fee: false,
            fee: "",
            gcash_qr: null,
        },
    });
    const hasFee = watch("has_fee", false);

    const [printData, setPrintData] = useState({
        resident_name: "",
        resident_address: "",
        purpose: "",
    });
    const [printErrors, setPrintErrors] = useState({});

    useEffect(() => {
        dispatch(fetchCertificateTypes());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error,
            });
        }
    }, [error]);

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    // Fetch residents when search query changes
    useEffect(() => {
        const fetchResidents = async () => {
            if (searchQuery.length > 0) {
                try {
                    const response = await axios.get("/api/barangay_residents");
                    const allResidents = response.data.data || response.data;

                    // Filter residents based on search query
                    const filtered = allResidents.filter((resident) => {
                        const fullName =
                            `${resident.firstName || ""} ${resident.middleName || ""} ${resident.lastName || ""}`.toLowerCase();
                        return fullName.includes(searchQuery.toLowerCase());
                    });

                    setResidents(filtered);
                    setShowResidentDropdown(true);
                } catch (error) {
                    console.error("Error fetching residents:", error);
                }
            } else {
                setResidents([]);
                setShowResidentDropdown(false);
            }
        };

        const debounceTimer = setTimeout(fetchResidents, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

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

    const handlePrintCertificate = (type) => {
        setSelectedType(type);
        setShowPrintModal(true);
        setSearchQuery("");
        setSelectedResident(null);
        setPrintData({
            resident_name: "",
            resident_address: "",
            purpose: "",
        });
        setPrintErrors({});
    };

    const handleSelectResident = (resident) => {
        const fullName =
            `${resident.firstName || ""} ${resident.middleName || ""} ${resident.lastName || ""}`.trim();
        const address =
            resident.address ||
            `${resident.houseNumber || ""} ${resident.street || ""}, ${resident.barangay || ""}`.trim();

        setSelectedResident(resident);
        setSearchQuery(fullName);
        setPrintData((prev) => ({
            ...prev,
            resident_name: fullName,
            resident_address: address,
        }));
        setShowResidentDropdown(false);
    };

    const handlePrintSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!printData.resident_name.trim()) {
            newErrors.resident_name = "Resident name is required";
        }
        if (!printData.resident_address.trim()) {
            newErrors.resident_address = "Resident address is required";
        }
        if (!printData.purpose.trim()) {
            newErrors.purpose = "Purpose is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setPrintErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post(
                "/api/certificates/generate-direct",
                {
                    certificate_type_id: selectedType.id,
                    ...printData,
                },
                {
                    responseType: "blob",
                },
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            setPdfUrl(url);
            setShowPrintModal(false);
            setShowPreviewModal(true);
        } catch (error) {
            console.error("Certificate generation error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to generate certificate",
            });
        }
    };

    const handlePrint = () => {
        if (pdfUrl) {
            const printWindow = window.open(pdfUrl, "_blank");
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print();
                };
            }
        }
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = `${selectedType.name}_${printData.resident_name}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleClosePreview = () => {
        setShowPreviewModal(false);
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
        setPrintData({
            resident_name: "",
            resident_address: "",
            purpose: "",
        });
    };

    const handlePrintChange = (e) => {
        const { name, value } = e.target;
        setPrintData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (printErrors[name]) {
            setPrintErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
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

            await axios.post("/api/certificate-types", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Certificate type has been added.",
                showConfirmButton: false,
                timer: 1500
            });

            reset();
            setQrPreview(null);
            setShowModal(false);
            
            // Refresh the list
            dispatch(fetchCertificateTypes());
        } catch (error) {
            const errorMessage = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join('\n')
                : error.response?.data?.message || 'Failed to add certificate type. Please try again.';

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage
            });
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
            cell: (row) => row.name,
        },
        {
            header: "Description",
            accessor: "description",
            cell: (row) => row.description || "-",
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
            cell: (row) => row?.has_fee && row?.fee ? `₱${parseFloat(row.fee).toFixed(2)}` : "-",
        },
        {
            header: "Actions",
            accessor: "actions",
            cell: (row) => (
                <button
                    onClick={() => handlePrintCertificate(row)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-900"
                >
                    <Printer className="w-4 h-4" />
                    Print Certificate
                </button>
            ),
        },
    ];

    return (
        <Layout>
            <div className="p-4">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Certificate Types
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                        Add Certificate Type
                    </button>
                </div>

                {/* Add Certificate Type Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        reset();
                        setQrPreview(null);
                    }}
                    title="Add Certificate Type"
                    width="max-w-md"
                >
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded-lg"
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
                                            required: hasFee
                                                ? "Fee is required"
                                                : false,
                                            min: {
                                                value: 0,
                                                message:
                                                    "Fee must be 0 or greater",
                                            },
                                        })}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            formErrors.fee
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.fee && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formErrors.fee.message}
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
                                            required: hasFee
                                                ? "QR code is required"
                                                : false,
                                        })}
                                        onChange={handleQrChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            formErrors.gcash_qr
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.gcash_qr && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formErrors.gcash_qr.message}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Accepted formats: JPG, JPEG, PNG (Max
                                        2MB)
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

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    reset();
                                    setQrPreview(null);
                                }}
                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Table */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={
                            Array.isArray(certificateTypes)
                                ? certificateTypes
                                : []
                        }
                    />
                )}

                {/* Print Certificate Modal */}
                <Modal
                    isOpen={showPrintModal}
                    onClose={setShowPrintModal}
                    title={`Print ${selectedType?.name || "Certificate"}`}
                    width="max-w-md"
                >
                    <form onSubmit={handlePrintSubmit} className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">
                                Search Resident
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className={`w-full p-2 pl-10 border rounded-lg ${
                                        printErrors.resident_name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Type resident name to search..."
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>

                            {/* Dropdown for search results */}
                            {showResidentDropdown && residents.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {residents.map((resident) => (
                                        <div
                                            key={resident.id}
                                            onClick={() =>
                                                handleSelectResident(resident)
                                            }
                                            className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                        >
                                            <div className="font-medium text-gray-900">
                                                {resident.firstName}{" "}
                                                {resident.middleName}{" "}
                                                {resident.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {resident.address ||
                                                    `${resident.houseNumber || ""} ${resident.street || ""}, ${resident.barangay || ""}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showResidentDropdown &&
                                residents.length === 0 &&
                                searchQuery.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm text-gray-500">
                                        No residents found
                                    </div>
                                )}

                            {printErrors.resident_name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {printErrors.resident_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Resident Name
                            </label>
                            <input
                                type="text"
                                name="resident_name"
                                value={printData.resident_name}
                                onChange={handlePrintChange}
                                className={`w-full p-2 border rounded-lg bg-gray-50 ${
                                    printErrors.resident_name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Auto-filled from search"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Resident Address
                            </label>
                            <input
                                type="text"
                                name="resident_address"
                                value={printData.resident_address}
                                onChange={handlePrintChange}
                                className={`w-full p-2 border rounded-lg ${
                                    printErrors.resident_address
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter or edit address"
                            />
                            {printErrors.resident_address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {printErrors.resident_address}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Purpose
                            </label>
                            <textarea
                                name="purpose"
                                value={printData.purpose}
                                onChange={handlePrintChange}
                                rows="3"
                                className={`w-full p-2 border rounded-lg ${
                                    printErrors.purpose
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter purpose of certificate"
                            />
                            {printErrors.purpose && (
                                <p className="text-red-500 text-sm mt-1">
                                    {printErrors.purpose}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setShowPrintModal(false)}
                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                <Printer className="w-4 h-4" />
                                Generate Preview
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* PDF Preview Modal */}
                {showPreviewModal && pdfUrl && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-xl font-semibold">
                                    Certificate Preview
                                </h2>
                                <button
                                    onClick={handleClosePreview}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full border-0"
                                    title="Certificate Preview"
                                />
                            </div>

                            <div className="p-4 border-t flex justify-end gap-3">
                                <button
                                    onClick={handleClosePreview}
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    <Printer className="w-4 h-4" />
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
