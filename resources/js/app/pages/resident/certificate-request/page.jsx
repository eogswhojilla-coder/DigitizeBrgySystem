// resources/js/app/pages/resident/certificate-request/page.jsx

import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { FileText, Upload, CheckCircle, Clock, XCircle, Info, DollarSign, List, ClipboardList, Printer } from 'lucide-react';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

export default function Page() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const [certificateTypes, setCertificateTypes] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [activeTab, setActiveTab] = useState("request"); // "request", "types", "history"
    const [selectedCertificateType, setSelectedCertificateType] = useState(null);

    const watchedCertificateTypeId = watch("certificate_type_id");

    useEffect(() => {
        fetchCertificateTypes();
        fetchMyRequests();
    }, []);

    useEffect(() => {
        if (watchedCertificateTypeId) {
            const certType = certificateTypes.find(ct => ct.id == watchedCertificateTypeId);
            setSelectedCertificateType(certType);
        } else {
            setSelectedCertificateType(null);
        }
    }, [watchedCertificateTypeId, certificateTypes]);

    const fetchCertificateTypes = async () => {
        try {
            const response = await axios.get("/api/certificate-types");
            setCertificateTypes(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching certificate types:", error);
        }
    };

    const fetchMyRequests = async () => {
        try {
            const response = await axios.get("/api/my-certificate-requests");
            setMyRequests(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const handlePrintCertificate = async (requestId) => {
        try {
            const response = await axios.get(`/api/certificate-requests/${requestId}/print`, {
                responseType: 'blob'
            });
            
            // Create a blob URL and open in new tab
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            
            // Clean up
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
            
            // Refresh requests to update status
            fetchMyRequests();
        } catch (error) {
            console.error("Error printing certificate:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to print certificate. Please try again.",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                Swal.fire({
                    icon: "error",
                    title: "File too large",
                    text: "Please upload a file smaller than 2MB",
                });
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                Swal.fire({
                    icon: "error",
                    title: "File too large",
                    text: "Please upload a file smaller than 2MB",
                });
                return;
            }
            setReceiptFile(file);
        }
    };

    const onSubmit = async (data) => {
        if (!selectedFile) {
            Swal.fire({
                icon: "error",
                title: "Missing Valid ID",
                text: "Please upload your valid ID",
            });
            return;
        }

        // Check if certificate has fee and receipt is required
        if (selectedCertificateType?.has_fee && selectedCertificateType?.fee > 0 && !receiptFile) {
            Swal.fire({
                icon: "error",
                title: "Missing Payment Receipt",
                text: "Please upload your payment receipt",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("certificate_type_id", data.certificate_type_id);
            formData.append("purpose", data.purpose);
            formData.append("valid_id", selectedFile);
            
            if (receiptFile) {
                formData.append("payment_receipt", receiptFile);
            }

            const token = document.head.querySelector('meta[name="csrf-token"]');
            await axios.post("/api/certificate-requests", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'X-CSRF-TOKEN': token ? token.content : ''
                },
            });

            await Swal.fire({
                icon: "success",
                title: "Request Submitted",
                text: "Your certificate request has been submitted successfully",
                showConfirmButton: false,
                timer: 1500,
            });

            reset();
            setSelectedFile(null);
            setReceiptFile(null);
            setSelectedCertificateType(null);
            fetchMyRequests();
            setActiveTab("history");
        } catch (error) {
            console.error("Error submitting request:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to submit request. Please try again.",
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "APPROVED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                    </span>
                );
            case "PENDING_VERIFICATION":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending Verification
                    </span>
                );
            case "VERIFIED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Info className="w-4 h-4 mr-1" />
                        Verified
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejected
                    </span>
                );
            case "FOR_RELEASE":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <ClipboardList className="w-4 h-4 mr-1" />
                        For Release
                    </span>
                );
            case "RELEASED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Released
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {status}
                    </span>
                );
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Certificate Services
                    </h1>
                    <p className="text-gray-600 mt-1">Request barangay certificates online</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("request")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                                activeTab === "request"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <ClipboardList className="w-5 h-5" />
                            New Request
                        </button>
                        <button
                            onClick={() => setActiveTab("types")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                                activeTab === "types"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <List className="w-5 h-5" />
                            Available Certificates
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                                activeTab === "history"
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <FileText className="w-5 h-5" />
                            My Requests ({myRequests.length})
                        </button>
                    </div>
                </div>

                {/* Request Form Tab */}
                {activeTab === "request" && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">New Certificate Request</h2>
                        
                        {/* Info Banner */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Requirements:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Valid ID (Government-issued ID, School ID, or any valid identification)</li>
                                        <li>Clear purpose for the certificate</li>
                                        <li>Ensure all information is accurate before submitting</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Certificate Type *
                                </label>
                                <select
                                    {...register("certificate_type_id", {
                                        required: "Please select a certificate type",
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select certificate type</option>
                                    {certificateTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name} {type.has_fee && type.fee > 0 ? `- ₱${parseFloat(type.fee).toFixed(2)}` : '- Free'}
                                        </option>
                                    ))}
                                </select>
                                {errors.certificate_type_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.certificate_type_id.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Purpose *
                                </label>
                                <textarea
                                    {...register("purpose", {
                                        required: "Purpose is required",
                                    })}
                                    rows={4}
                                    placeholder="Enter the purpose of your certificate request..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.purpose && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.purpose.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Valid ID * (Max 2MB)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-2">
                                        <label className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                            Click to upload
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, PDF up to 2MB
                                        </p>
                                    </div>
                                    {selectedFile && (
                                        <p className="mt-2 text-sm text-green-600 font-medium">
                                            ✓ {selectedFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Section - Show only if certificate has fee */}
                            {selectedCertificateType?.has_fee && selectedCertificateType?.fee > 0 && (
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <DollarSign className="w-6 h-6 text-blue-600" />
                                        Payment Required
                                    </h3>
                                    
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Amount to Pay:</span>{" "}
                                            <span className="text-2xl font-bold text-blue-600">
                                                ₱{parseFloat(selectedCertificateType.fee).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">GCash Payment Instructions:</h4>
                                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-4">
                                            <li>Scan the QR code below using your GCash app</li>
                                            <li>Pay the exact amount: ₱{parseFloat(selectedCertificateType.fee).toFixed(2)}</li>
                                            <li>Take a screenshot of your payment confirmation</li>
                                            <li>Upload the screenshot below</li>
                                        </ol>
                                        
                                        <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                                            <div className="text-center">
                                                {/* Display certificate type specific GCash QR code */}
                                                <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                                                    {selectedCertificateType?.gcash_qr_url ? (
                                                        <img 
                                                            src={selectedCertificateType.gcash_qr_url} 
                                                            alt="GCash QR Code"
                                                            className="w-48 h-48 object-contain mx-auto"
                                                            onError={(e) => {
                                                                console.error('Failed to load QR code:', selectedCertificateType.gcash_qr_url);
                                                                e.target.style.display = 'none';
                                                                if (e.target.nextElementSibling) {
                                                                    e.target.nextElementSibling.style.display = 'flex';
                                                                }
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div 
                                                        className={`${selectedCertificateType?.gcash_qr_url ? 'hidden' : 'flex'} w-48 h-48 items-center justify-center bg-gray-200 text-gray-500 text-sm text-center flex-col gap-2 rounded`}
                                                        style={{ display: selectedCertificateType?.gcash_qr_url ? 'none' : 'flex' }}
                                                    >
                                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                        <span className="font-semibold">GCash QR Code</span>
                                                        <span className="text-xs">Not Available</span>
                                                        <span className="text-xs text-red-500">Please contact the barangay</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-2">Scan to pay via GCash</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Payment Receipt * (Max 2MB)
                                        </label>
                                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-white">
                                            <Upload className="mx-auto h-12 w-12 text-blue-400" />
                                            <div className="mt-2">
                                                <label className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                                    Click to upload receipt
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={handleReceiptChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG, PDF up to 2MB
                                                </p>
                                            </div>
                                            {receiptFile && (
                                                <p className="mt-2 text-sm text-green-600 font-medium">
                                                    ✓ {receiptFile.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 font-medium flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5" />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Certificate Types Tab */}
                {activeTab === "types" && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Certificate Types</h2>
                        <p className="text-gray-600 mb-6">Browse available barangay certificates and their fees</p>

                        {certificateTypes.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    No certificate types available
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Please check back later
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {certificateTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            {type.has_fee && type.fee > 0 ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    ₱{parseFloat(type.fee).toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {type.name}
                                        </h3>
                                        {type.description && (
                                            <p className="text-sm text-gray-600 mb-4">
                                                {type.description}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => setActiveTab("request")}
                                            className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Request This Certificate
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* My Requests Tab */}
                {activeTab === "history" && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">My Certificate Requests</h2>
                        {myRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    No requests yet
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Submit your first certificate request
                                </p>
                                <button
                                    onClick={() => setActiveTab("request")}
                                    className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Make a Request
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Request #
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Certificate Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Purpose
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Fee
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Date Requested
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {myRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {request.request_number || `#${request.id}`}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {request.certificate_type?.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                                                    {request.purpose}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                    {request.certificate_type?.has_fee && request.certificate_type?.fee > 0 
                                                        ? `₱${parseFloat(request.certificate_type.fee).toFixed(2)}`
                                                        : 'Free'
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {moment(request.created_at).format("MMM DD, YYYY")}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(request.status)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {(request.status === 'APPROVED' || request.status === 'FOR_RELEASE' || request.status === 'RELEASED') && (
                                                        <button
                                                            onClick={() => handlePrintCertificate(request.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                            title="Print Certificate"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                            Print
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}