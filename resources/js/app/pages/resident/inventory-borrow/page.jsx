// resources/js/app/pages/resident/inventory-borrow/page.jsx

import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { Package, Calendar, User, CheckCircle, Clock, XCircle, ArrowLeft, CreditCard, Eye, MapPin, X } from 'lucide-react';
import { Image as AntImage } from 'antd';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

export default function Page() {
        const [showReceipt, setShowReceipt] = useState(false);
        const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [myBorrowRequests, setMyBorrowRequests] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [viewingRequest, setViewingRequest] = useState(null);
    const [availableInventories, setAvailableInventories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        // Fetch available inventories from resident-specific endpoint
        fetchAvailableInventories();
        fetchMyBorrowRequests();
    }, []);

    const fetchAvailableInventories = async () => {
        try {
            console.log('[Inventory] Fetching available inventories...');
            const response = await axios.get("/api/inventories/available");
            console.log('[Inventory] API Response status:', response.status);
            console.log('[Inventory] API Response data:', response.data);
            
            const items = response.data.data || response.data;
            console.log('[Inventory] Parsed items:', items);
            console.log('[Inventory] Items count:', items.length);
            
            setAvailableInventories(items);
        } catch (error) {
            console.error("[Inventory] Error fetching available inventories:", error);
            console.error("[Inventory] Error status:", error.response?.status);
            console.error("[Inventory] Error data:", error.response?.data);
            console.error("[Inventory] Error message:", error.message);
            
            // Show error to user
            if (error.response?.status === 401) {
                console.error("[Inventory] Authentication error - user not logged in or session expired");
            } else if (error.response?.status === 403) {
                console.error("[Inventory] Permission denied - user doesn't have resident role");
            } else if (error.response?.status === 419) {
                console.error("[Inventory] CSRF token mismatch");
            }
            
            setAvailableInventories([]);
        }
    };

    const availableItems = availableInventories;
    // Filter items by search term
    const filteredItems = availableItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchMyBorrowRequests = async () => {
        try {
            const response = await axios.get("/api/my-borrow-requests");
            setMyBorrowRequests(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching borrow requests:", error);
            // Set empty array if API doesn't exist yet
            setMyBorrowRequests([]);
        }
    };

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setReceiptPreview(null);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('inventory_id', selectedItem.id);
            formData.append('quantity', data.quantity);
            formData.append('borrow_date', data.borrow_date);
            formData.append('return_date', data.return_date);
            formData.append('contact_number', data.contact_number);
            formData.append('purpose', data.purpose);

            // Add payment fields if item has fee
            if (selectedItem.has_fee) {
                formData.append('payment_reference', data.payment_reference);
                if (data.payment_receipt && data.payment_receipt[0]) {
                    formData.append('payment_receipt', data.payment_receipt[0]);
                }
            }

            await axios.post("/api/borrow-requests", formData);

            await Swal.fire({
                icon: "success",
                title: "Request Submitted",
                text: "Your borrow request has been submitted successfully",
                showConfirmButton: false,
                timer: 1500,
            });

            reset();
            setSelectedItem(null);
            setReceiptPreview(null);
            fetchMyBorrowRequests();
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
            case "approved":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejected
                    </span>
                );
            case "returned":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Returned
                    </span>
                );
            case "borrowed":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Package className="w-4 h-4 mr-1" />
                        Borrowed
                    </span>
                );
            default:
                return status;
        }
    };

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                        Inventory Borrow Request
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Request to borrow barangay equipment and supplies</p>
                </div>

                {!selectedItem ? (
                    <>
                        {/* Available Items Grid */}
                        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Available Items</h2>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search item name..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="mx-auto h-16 w-16 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        No items found
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Try searching for another item name
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredItems.map((item) => {
                                        const available = item.quantity - (item.borrowed || 0) - (item.damaged || 0);
                                        return (
                                            <div
                                                key={item.id}
                                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                            >
                                                {/* Item Image */}
                                                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-gray-400">
                                                            <Package className="mx-auto h-12 w-12 mb-1" />
                                                            <span className="text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {item.name}
                                                    </h3>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.category || 'Equipment'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="space-y-2 text-sm text-gray-700 mb-4">
                                                    <div className="flex justify-between">
                                                        <span>Available:</span>
                                                        <span className="font-semibold text-green-600">
                                                            {available} / {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Condition:</span>
                                                        <span className="font-semibold">{item.condition}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Location:</span>
                                                        <span className="font-semibold">{item.location}</span>
                                                    </div>
                                                    {item.has_fee && (
                                                        <div className="flex justify-between items-center pt-2 border-t">
                                                            <span className="text-yellow-700 font-medium">Borrowing Fee:</span>
                                                            <span className="font-bold text-green-700">₱{Number(item.price).toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    disabled={available <= 0}
                                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                                                >
                                                    {available > 0 ? "Request to Borrow" : "Not Available"}
                                                </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Borrow Request Form */
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Items
                        </button>
                        
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Borrow Request Form</h2>
                        
                        {/* Selected Item Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Item Image */}
                                {selectedItem.image ? (
                                    <div className="flex-shrink-0">
                                        <AntImage
                                            src={selectedItem.image}
                                            alt={selectedItem.name}
                                            width={160}
                                            height={160}
                                            className="rounded-lg object-cover"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0 w-40 h-40 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                                        <div className="text-center text-gray-400">
                                            <Package className="mx-auto h-12 w-12 mb-1" />
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 mb-2">Selected Item:</h3>
                            <p className="text-blue-800 text-lg font-bold">{selectedItem.name}</p>
                            <p className="text-sm text-blue-700 mt-1">{selectedItem.description}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-700">
                                <span>Available: {selectedItem.quantity - (selectedItem.borrowed || 0) - (selectedItem.damaged || 0)}</span>
                                 <span>•</span>
                                <span>Category: {selectedItem.category || 'Equipment'}</span>
                                {selectedItem.has_fee && (
                                    <>
                                        <span>•</span>
                                        <span className="font-semibold text-green-700">Fee: ₱{Number(selectedItem.price).toFixed(2)} / item</span>
                                        {watch("quantity") > 0 && (
                                            <>
                                                <span>•</span>
                                                <span className="font-bold text-red-600">Total: ₱{(Number(selectedItem.price) * Number(watch("quantity"))).toFixed(2)}</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedItem.quantity - (selectedItem.borrowed || 0) - (selectedItem.damaged || 0)}
                                        {...register("quantity", {
                                            required: "Quantity is required",
                                            min: { value: 1, message: "Minimum quantity is 1" },
                                            max: {
                                                value: selectedItem.quantity - (selectedItem.borrowed || 0) - (selectedItem.damaged || 0),
                                                message: `Maximum available is ${selectedItem.quantity - (selectedItem.borrowed || 0) - (selectedItem.damaged || 0)}`
                                            },
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.quantity && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.quantity.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Borrow Date *
                                    </label>
                                    <input
                                        type="date"
                                        min={moment().format("YYYY-MM-DD")}
                                        {...register("borrow_date", {
                                            required: "Borrow date is required",
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.borrow_date && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.borrow_date.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Return Date *
                                    </label>
                                    <input
                                        type="date"
                                        min={watch("borrow_date") || moment().format("YYYY-MM-DD")}
                                        {...register("return_date", {
                                            required: "Return date is required",
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.return_date && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.return_date.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="09XXXXXXXXX"
                                        {...register("contact_number", {
                                            required: "Contact number is required",
                                            pattern: {
                                                value: /^09\d{9}$/,
                                                message: "Invalid contact number format"
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.contact_number && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.contact_number.message}
                                        </p>
                                    )}
                                </div>
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
                                    placeholder="Enter the purpose of borrowing this item..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                {errors.purpose && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.purpose.message}
                                    </p>
                                )}
                            </div>

                            {/* Payment Section - Show only if item has a fee */}
                            {selectedItem.has_fee && (
                                <div className="border-t border-gray-200 pt-4 space-y-4">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CreditCard className="w-5 h-5 text-yellow-700" />
                                            <h3 className="font-semibold text-yellow-900">Payment Required</h3>
                                        </div>
                                        <p className="text-sm text-yellow-800 mb-2">
                                            This item requires a borrowing fee of <span className="font-bold">₱{Number(selectedItem.price).toFixed(2)}</span> per item.
                                        </p>
                                        <div className="bg-white rounded-md px-4 py-3 border border-yellow-300">
                                            <div className="flex items-center justify-between text-sm text-gray-700">
                                                <span>₱{Number(selectedItem.price).toFixed(2)} × {watch("quantity") || 0} item(s)</span>
                                                <span className="text-lg font-bold text-green-700">
                                                    Total: ₱{(Number(selectedItem.price) * Number(watch("quantity") || 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* QR Code Display */}
                                        {selectedItem.gcash_qr_url && (
                                            <div className="bg-white rounded-lg p-4 mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    Scan this QR Code to pay via GCash:
                                                </p>
                                                <img
                                                    src={selectedItem.gcash_qr_url}
                                                    alt="GCash QR Code"
                                                    className="max-w-xs mx-auto rounded-lg shadow-sm border border-gray-200"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Payment Reference */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Reference Number *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 1234567890"
                                                {...register("payment_reference", {
                                                    required: selectedItem.has_fee ? "Payment reference is required" : false,
                                                })}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                                    errors.payment_reference ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.payment_reference && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.payment_reference.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Payment Receipt Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Receipt (Screenshot) *
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                {...register("payment_receipt", {
                                                    required: selectedItem.has_fee ? "Payment receipt is required" : false,
                                                })}
                                                onChange={handleReceiptChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                                    errors.payment_receipt ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {errors.payment_receipt && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.payment_receipt.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Receipt Preview */}
                                    {receiptPreview && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Receipt Preview
                                            </label>
                                            <div className="border rounded-lg p-4 bg-gray-50">
                                                <img
                                                    src={receiptPreview}
                                                    alt="Receipt Preview"
                                                    className="max-w-sm mx-auto rounded-lg shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 font-medium"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Request"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedItem(null)}
                                    className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* My Borrow Requests */}
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">My Borrow Requests</h2>
                    {myBorrowRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No borrow requests yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Item
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Quantity
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Borrow Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Return Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Purpose
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {myBorrowRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {request.inventory?.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {request.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {moment(request.borrow_date).format("MMM DD, YYYY")}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {moment(request.return_date).format("MMM DD, YYYY")}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                                                {request.purpose}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(request.status)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setViewingRequest(request)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* View Request Details Modal */}
                {viewingRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Request Details</h3>
                                <button
                                    onClick={() => setViewingRequest(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Request Number */}
                                {viewingRequest.request_number && (
                                    <div>
                                        <p className="text-sm text-gray-600">Request Number</p>
                                        <p className="text-lg font-semibold text-gray-900">{viewingRequest.request_number}</p>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700">Status:</span>
                                    {getStatusBadge(viewingRequest.status)}
                                </div>

                                {/* Approved - Ready to Pick Up Message */}
                                {viewingRequest.status === 'approved' && (
                                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="text-green-900 font-bold text-lg mb-1">
                                                    ✅ Request Approved - Ready to Pick Up!
                                                </h4>
                                                <p className="text-green-800 text-sm">
                                                    Your borrow request has been approved. You can now pick up the equipment from the location below.
                                                </p>
                                            </div>
                                            <div className="ml-auto">
                                                <button
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
                                                    onClick={() => setReceiptModalOpen(true)}
                                                >
                                                    View Receipt
                                                </button>
                                            </div>
                                                                        {receiptModalOpen && (
                                                                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                                                <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-xs sm:max-w-sm md:max-w-md relative mx-2" style={{maxWidth:'400px'}}>
                                                                                    <button
                                                                                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                                                                        onClick={() => setReceiptModalOpen(false)}
                                                                                    >
                                                                                        <span style={{fontSize:'20px',fontWeight:'bold'}}>×</span>
                                                                                    </button>
                                                                                    <div className="flex flex-col items-center">
                                                                                        <div className="receipt w-full" style={{padding:'0',border:'none',borderRadius:'8px',background:'#fff'}}>
                                                                                            <div className="header" style={{textAlign:'center',marginBottom:'8px'}}>
                                                                                             <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'8px'}}>
                                                                                              <img src="/images/brgy-ll-logo.png" style={{width:'48px',height:'48px'}} alt="Barangay Logo" />
                                                                                             </div>
                                                                                             <div style={{fontSize:'16px',fontWeight:'bold'}}>Barangay Name</div>
                                                                                             <div style={{fontSize:'13px',color:'#555'}}>Item Claim Receipt</div>
                                                                                            </div>
                                                                                            <div className="divider" style={{borderTop:'1px dashed #bbb',margin:'8px 0'}}></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Request ID:</span><span className="value font-bold">{viewingRequest.request_number || viewingRequest.id}</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Resident:</span><span className="value font-bold">{
                                                                                             viewingRequest.user?.full_name ||
                                                                                             [viewingRequest.user?.first_name, viewingRequest.user?.middle_name, viewingRequest.user?.last_name].filter(Boolean).join(' ') ||
                                                                                             viewingRequest.user?.email || 'No Name'
                                                                                         }</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Item:</span><span className="value font-bold">{viewingRequest.inventory?.name || ''}</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Quantity:</span><span className="value font-bold">{viewingRequest.quantity}</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Request Date:</span><span className="value font-bold">{moment(viewingRequest.created_at).format('MMM DD, YYYY')}</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Approval Date:</span><span className="value font-bold">{moment(viewingRequest.updated_at).format('MMM DD, YYYY')}</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Return Date:</span><span className="value font-bold">{viewingRequest.return_date ? moment(viewingRequest.return_date).format('MMM DD, YYYY') : '-'}</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Approved By:</span><span className="value font-bold">{
                                                                                             (() => {
                                                                                              const approver = viewingRequest.approvedBy;
                                                                                              if (approver && typeof approver === 'object') {
                                                                                               return approver.full_name || [approver.first_name, approver.middle_name, approver.last_name].filter(Boolean).join(' ') || approver.email || 'Barangay Staff';
                                                                                              }
                                                                                              return viewingRequest.approved_by || 'Barangay Staff';
                                                                                           })()
                                                                                         }</span></div>
                                                                                            <div className="row flex justify-between mb-1 text-xs"><span className="label text-gray-500">Amount Paid:</span><span className="value font-bold">{
                                                                                             viewingRequest.inventory?.has_fee
                                                                                               ? `₱${(Number(viewingRequest.inventory.price) * Number(viewingRequest.quantity)).toFixed(2)}`
                                                                                               : 'N/A'
                                                                                         }</span></div>
                                                                                            <div className="divider" style={{borderTop:'1px dashed #bbb',margin:'8px 0'}}></div>
                                                                                            <div className="signature mt-4">
                                                                                                <span className="label text-gray-500">Staff Signature:</span><br/>
                                                                                                <span className="signature-line" style={{borderBottom:'1px solid #888',width:'120px',display:'inline-block',marginTop:'8px'}}></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <button
                                                                                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
                                                                                            onClick={() => {
                                                                                                const printContents = document.querySelector('.receipt').innerHTML;
                                                                                                const printWindow = window.open('', 'PRINT', 'width=400,height=600');
                                                                                                printWindow.document.write(`<html><head><title>Print Receipt</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;} .header{text-align:center;margin-bottom:8px;} .row{display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px;} .label{color:#555;} .value{font-weight:bold;} .divider{border-top:1px dashed #bbb;margin:8px 0;} .signature{margin-top:16px;} .signature-line{border-bottom:1px solid #888;width:120px;display:inline-block;margin-top:8px;} .receipt{width:320px;margin:0 auto;padding:16px;border:1px solid #ccc;border-radius:8px;} </style></head><body><div class='receipt'>${printContents}</div><script>window.print();setTimeout(()=>window.close(),500);</script></body></html>`);
                                                                                                printWindow.document.close();
                                                                                            }}
                                                                                        >
                                                                                            Print
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                        </div>
                                    </div>
                                )}

                                {/* Declined Message */}
                                {viewingRequest.status === 'declined' && viewingRequest.remarks && (
                                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-red-900 font-bold text-lg mb-1">
                                                    Request Declined
                                                </h4>
                                                <p className="text-red-800 text-sm">
                                                    <span className="font-medium">Reason:</span> {viewingRequest.remarks}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Item Information */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Item Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Item Name:</span>
                                            <span className="font-medium text-gray-900">{viewingRequest.inventory?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium text-gray-900">{viewingRequest.inventory?.category || 'Equipment'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Quantity:</span>
                                            <span className="font-medium text-gray-900">{viewingRequest.quantity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Condition:</span>
                                            <span className="font-medium text-gray-900">{viewingRequest.inventory?.condition}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup Location - Only show when approved */}
                                {viewingRequest.status === 'approved' && viewingRequest.inventory?.location && (
                                    <div className="border-t pt-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-blue-900 mb-1">Pickup Location</h4>
                                                    <p className="text-blue-800 text-lg font-medium">
                                                        {viewingRequest.inventory.location}
                                                    </p>
                                                    <p className="text-blue-700 text-sm mt-2">
                                                        Please proceed to this location to pick up your equipment.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Request Details */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Request Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Borrow Date:</span>
                                            <span className="font-medium text-gray-900">
                                                {moment(viewingRequest.borrow_date).format("MMMM DD, YYYY")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Return Date:</span>
                                            <span className="font-medium text-gray-900">
                                                {moment(viewingRequest.return_date).format("MMMM DD, YYYY")}
                                            </span>
                                        </div>
                                        {viewingRequest.actual_return_date && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Actual Return Date:</span>
                                                <span className="font-medium text-gray-900">
                                                    {moment(viewingRequest.actual_return_date).format("MMMM DD, YYYY")}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Contact Number:</span>
                                            <span className="font-medium text-gray-900">{viewingRequest.contact_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Request Date:</span>
                                            <span className="font-medium text-gray-900">
                                                {moment(viewingRequest.created_at).format("MMMM DD, YYYY")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Purpose */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
                                    <p className="text-gray-700">{viewingRequest.purpose}</p>
                                </div>

                                {/* Payment Information */}
                                {viewingRequest.payment_reference && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Reference:</span>
                                                <span className="font-medium text-gray-900">{viewingRequest.payment_reference}</span>
                                            </div>
                                            {viewingRequest.inventory?.has_fee && (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Fee per Item:</span>
                                                        <span className="font-medium text-gray-900">₱{Number(viewingRequest.inventory.price).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Quantity:</span>
                                                        <span className="font-medium text-gray-900">{viewingRequest.quantity}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-dashed">
                                                        <span className="text-gray-900 font-semibold">Total Paid:</span>
                                                        <span className="text-lg font-bold text-green-700">₱{(Number(viewingRequest.inventory.price) * Number(viewingRequest.quantity)).toFixed(2)}</span>
                                                    </div>
                                                </>
                                            )}
                                            {viewingRequest.payment_receipt_url && (
                                                <div className="mt-3">
                                                    <p className="text-sm text-gray-600 mb-2">Payment Receipt:</p>
                                                    <img
                                                        src={viewingRequest.payment_receipt_url}
                                                        alt="Payment Receipt"
                                                        className="max-w-xs border rounded-lg shadow-sm"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Remarks */}
                                {viewingRequest.remarks && viewingRequest.status !== 'declined' && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Remarks</h4>
                                        <p className="text-gray-700">{viewingRequest.remarks}</p>
                                    </div>
                                )}
                            </div>

                            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
                                <button
                                    onClick={() => setViewingRequest(null)}
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}