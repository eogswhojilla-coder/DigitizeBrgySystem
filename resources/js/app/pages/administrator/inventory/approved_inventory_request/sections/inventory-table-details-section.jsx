import Button from '@/app/_components/button';
import TextArea from '@/app/_components/textarea';
import { ArrowLeft, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function InventoryTableDetailsSection({ data, tab }) {
    const [selectedRequest, setSelectedRequest] = useState('');
    const [show, setShow] = useState(false)
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);

    useEffect(() => {
        setShow(false)
    }, [tab])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Declined': return 'bg-red-100 text-red-800 border-red-200';
            case 'Returned': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    return (
        <>
            {
                !show && <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{data.residentName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tab)}`}>
                            {tab}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                            <span className="font-medium">Item:</span> {data.itemName}
                        </div>
                        <div>
                            <span className="font-medium">Quantity:</span> {data.quantity}
                        </div>
                        <div>
                            <span className="font-medium">Date Needed:</span> {data.dateNeeded}
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm">
                        <span className="font-medium">Reason:</span> {data.reason}
                    </p>
                </div>
            }
            {
                !show && <button
                    onClick={() => setShow(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 font-medium ml-4"
                >
                    <Eye size={16} />
                    View Details
                </button>
            }

            {
                show && <div className="w-full mx-auto p-6 bg-white">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setShow(false)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <ArrowLeft size={20} />
                            Back to Requests
                        </button>
                    </div>

                    {/* Request Details */}
                    <div className="bg-white border rounded-lg shadow-sm">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(selectedRequest.status)}`}>
                                    {tab}
                                </span>
                            </div>
                            <div>
                                {
                                    tab == "Pending" && <Button
                                        variant='success'
                                        size='lg'
                                        onClick={() => alert()}
                                    >
                                        APRROVED
                                    </Button>
                                }

                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Resident Information</h3>
                                    <p className="text-gray-700"><span className="font-medium">Name:</span> {selectedRequest.residentName}</p>
                                    <p className="text-gray-700"><span className="font-medium">Request Date:</span> {selectedRequest.requestDate}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Item Details</h3>
                                    <p className="text-gray-700"><span className="font-medium">Item:</span> {selectedRequest.itemName}</p>
                                    <p className="text-gray-700"><span className="font-medium">Quantity:</span> {selectedRequest.quantity}</p>
                                    {selectedRequest.status === 'Pending' && (
                                        <p className="text-gray-700"><span className="font-medium">Available Stock:</span> {selectedRequest.availableStock}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
                                <p className="text-gray-700"><span className="font-medium">Reason:</span> {selectedRequest.reason}</p>
                                <p className="text-gray-700"><span className="font-medium">Date Needed:</span> {selectedRequest.dateNeeded}</p>
                            </div>

                            {
                                tab == 'Pending' && <div>
                                    <div className='flex w-full gap-3 items-center justify-end'>
                                        <TextArea
                                            rows={2}
                                            label="Write reason to decline"

                                        />
                                    </div>

                                    <div className='flex items-center justify-end'>
                                        <Button
                                            variant='danger'
                                            size='lg'
                                            className='w-1/4'
                                            onClick={() => alert()}
                                        >
                                            Decline Reason
                                        </Button>
                                    </div>
                                </div>
                            }

                        </div>

                        {/* Action Buttons */}
                        {selectedRequest.status === 'Pending' && (
                            <div className="border-t px-6 py-4 flex gap-3">
                                <button
                                    onClick={() => handleApprove(selectedRequest.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                    disabled={selectedRequest.availableStock < selectedRequest.quantity}
                                >
                                    <CheckCircle size={16} />
                                    Approve Request
                                </button>
                                <button
                                    onClick={() => setShowDeclineModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                >
                                    <XCircle size={16} />
                                    Decline Request
                                </button>
                                {selectedRequest.availableStock < selectedRequest.quantity && (
                                    <p className="text-red-600 text-sm self-center ml-4">
                                        Insufficient stock available ({selectedRequest.availableStock} available, {selectedRequest.quantity} requested)
                                    </p>
                                )}
                            </div>
                        )}

                        {selectedRequest.status === 'Approved' && (
                            <div className="border-t px-6 py-4">
                                <button
                                    onClick={() => setShowReturnModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    <Package size={16} />
                                    Mark as Returned
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Decline Modal */}
                    {showDeclineModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4">Decline Request</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for decline (optional)
                                    </label>
                                    <textarea
                                        value={declineReason}
                                        onChange={(e) => setDeclineReason(e.target.value)}
                                        placeholder="e.g., Item not available, insufficient quantity..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleDecline(selectedRequest.id)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                    >
                                        Decline Request
                                    </button>
                                    <button
                                        onClick={() => setShowDeclineModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Return Modal */}
                    {showReturnModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4">Mark as Returned</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Condition after use
                                        </label>
                                        <select
                                            value={returnCondition}
                                            onChange={(e) => setReturnCondition(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Excellent">Excellent</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                            <option value="Damaged">Damaged</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Return notes (optional)
                                        </label>
                                        <textarea
                                            value={returnNotes}
                                            onChange={(e) => setReturnNotes(e.target.value)}
                                            placeholder="Any additional notes about the return..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => handleMarkReturned(selectedRequest.id)}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        Mark as Returned
                                    </button>
                                    <button
                                        onClick={() => setShowReturnModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
        </>
    )
}
