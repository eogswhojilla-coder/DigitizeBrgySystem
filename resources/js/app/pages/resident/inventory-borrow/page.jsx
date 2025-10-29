// resources/js/app/pages/resident/inventory-borrow/page.jsx

import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { Package, Calendar, User, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { get_inventories_thunk } from "@/app/redux/inventories-thunk";

export default function Page() {
    const dispatch = useDispatch();
    const { inventories } = useSelector((state) => state.inventories);
    
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const [myBorrowRequests, setMyBorrowRequests] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        dispatch(get_inventories_thunk());
        fetchMyBorrowRequests();
    }, [dispatch]);

    const inventoryData = inventories?.data || inventories || [];
    const availableItems = inventoryData.filter(
        (item) => item.status === "Active" && item.quantity > (item.borrowed || 0)
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

    const onSubmit = async (data) => {
        try {
            await axios.post("/api/borrow-requests", {
                inventory_id: selectedItem.id,
                ...data,
            });

            await Swal.fire({
                icon: "success",
                title: "Request Submitted",
                text: "Your borrow request has been submitted successfully",
                showConfirmButton: false,
                timer: 1500,
            });

            reset();
            setSelectedItem(null);
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
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-8 h-8 text-green-600" />
                        Inventory Borrow Request
                    </h1>
                    <p className="text-gray-600 mt-1">Request to borrow barangay equipment and supplies</p>
                </div>

                {!selectedItem ? (
                    <>
                        {/* Available Items Grid */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Items</h2>
                            {availableItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="mx-auto h-16 w-16 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        No items available
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Check back later for available items to borrow
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {availableItems.map((item) => {
                                        const available = item.quantity - (item.borrowed || 0);
                                        return (
                                            <div
                                                key={item.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
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
                                                </div>
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    disabled={available <= 0}
                                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                                                >
                                                    {available > 0 ? "Request to Borrow" : "Not Available"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Borrow Request Form */
                    <div className="bg-white rounded-lg shadow-lg p-6">
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
                            <h3 className="font-semibold text-blue-900 mb-2">Selected Item:</h3>
                            <p className="text-blue-800 text-lg font-bold">{selectedItem.name}</p>
                            <p className="text-sm text-blue-700 mt-1">{selectedItem.description}</p>
                            <div className="flex gap-4 mt-2 text-sm text-blue-700">
                                <span>Available: {selectedItem.quantity - (selectedItem.borrowed || 0)}</span>
                                <span>•</span>
                                <span>Category: {selectedItem.category || 'Equipment'}</span>
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
                                        max={selectedItem.quantity - (selectedItem.borrowed || 0)}
                                        {...register("quantity", {
                                            required: "Quantity is required",
                                            min: { value: 1, message: "Minimum quantity is 1" },
                                            max: {
                                                value: selectedItem.quantity - (selectedItem.borrowed || 0),
                                                message: `Maximum available is ${selectedItem.quantity - (selectedItem.borrowed || 0)}`
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
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">My Borrow Requests</h2>
                    {myBorrowRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No borrow requests yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}