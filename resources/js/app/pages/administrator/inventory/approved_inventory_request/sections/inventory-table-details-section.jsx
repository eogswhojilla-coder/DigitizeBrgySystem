import Button from '@/app/_components/button';
import TextArea from '@/app/_components/textarea';
import { ArrowLeft, Eye, CheckCircle, XCircle, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import store from '@/app/store/store';
import { 
    approve_borrow_request_thunk, 
    decline_borrow_request_thunk,
    mark_as_returned_thunk 
} from '@/app/redux/borrow-requests-thunk';
import Swal from 'sweetalert2';

export default function InventoryTableDetailsSection({ data, tab }) {
    const [show, setShow] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [returnNotes, setReturnNotes] = useState('');
    const [returnCondition, setReturnCondition] = useState('Good');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setShow(false);
    }, [tab]);

    const handleApprove = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Approve Request?',
                text: 'This will approve the borrow request and update inventory.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, approve it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                setIsProcessing(true);
                await store.dispatch(approve_borrow_request_thunk(id, ''));
                await Swal.fire({
                    icon: 'success',
                    title: 'Approved!',
                    text: 'Borrow request has been approved.',
                    timer: 2000,
                    showConfirmButton: false
                });
                setShow(false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to approve request'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDecline = async (id) => {
        if (!declineReason.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Remarks Required',
                text: 'Please provide a reason for declining this request.'
            });
            return;
        }

        try {
            setIsProcessing(true);
            await store.dispatch(decline_borrow_request_thunk(id, declineReason));
            await Swal.fire({
                icon: 'success',
                title: 'Declined',
                text: 'Borrow request has been declined.',
                timer: 2000,
                showConfirmButton: false
            });
            setShowDeclineModal(false);
            setDeclineReason('');
            setShow(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to decline request'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMarkReturned = async (id) => {
        try {
            setIsProcessing(true);
            await store.dispatch(mark_as_returned_thunk(id, returnCondition, returnNotes));
            await Swal.fire({
                icon: 'success',
                title: 'Returned!',
                text: 'Item has been marked as returned.',
                timer: 2000,
                showConfirmButton: false
            });
            setShowReturnModal(false);
            setReturnNotes('');
            setReturnCondition('Good');
            setShow(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to mark as returned'
            });
        } finally {
            setIsProcessing(false);
        }
    };

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
                            <span className="font-medium">Borrow Date:</span> {data.borrow_date || data.dateNeeded || 'N/A'}
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm">
                        <span className="font-medium">Purpose:</span> {data.purpose || data.reason || 'N/A'}
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
                                {data.request_number && (
                                    <p className="text-sm text-gray-500 mt-1">Request #{data.request_number}</p>
                                )}
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(data.status)}`}>
                                    {data.status}
                                </span>
                            </div>
                            <div>
                                {tab === "Pending" && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant='success'
                                            size='lg'
                                            onClick={() => handleApprove(data.id)}
                                            disabled={isProcessing || data.availableStock < data.quantity}
                                        >
                                            {isProcessing ? 'Processing...' : 'APPROVE'}
                                        </Button>
                                        <Button
                                            variant='danger'
                                            size='lg'
                                            onClick={() => setShowDeclineModal(true)}
                                            disabled={isProcessing}
                                        >
                                            DECLINE
                                        </Button>
                                    </div>
                                )}
                                {tab === "Approved" && (
                                    <Button
                                        variant='primary'
                                        size='lg'
                                        onClick={() => setShowReturnModal(true)}
                                        disabled={isProcessing}
                                    >
                                        MARK AS RETURNED
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Resident Information</h3>
                                    <p className="text-gray-700"><span className="font-medium">Name:</span> {data.residentName}</p>
                                    <p className="text-gray-700"><span className="font-medium">Contact:</span> {data.contact_number || 'N/A'}</p>
                                    <p className="text-gray-700"><span className="font-medium">Request Date:</span> {data.requestDate}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Item Details</h3>
                                    <p className="text-gray-700"><span className="font-medium">Item:</span> {data.itemName}</p>
                                    <p className="text-gray-700"><span className="font-medium">Quantity:</span> {data.quantity}</p>
                                    {data.status === 'Pending' && (
                                        <p className="text-gray-700"><span className="font-medium">Available Stock:</span> {data.availableStock}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
                                <p className="text-gray-700"><span className="font-medium">Purpose:</span> {data.purpose || data.reason || 'N/A'}</p>
                                <p className="text-gray-700"><span className="font-medium">Borrow Date:</span> {data.borrow_date || 'N/A'}</p>
                                <p className="text-gray-700"><span className="font-medium">Return Date:</span> {data.return_date || 'N/A'}</p>
                                {data.actual_return_date && (
                                    <p className="text-gray-700"><span className="font-medium">Actual Return Date:</span> {data.actual_return_date}</p>
                                )}
                            </div>

                            {data.payment_reference && (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Payment Information</h3>
                                    <p className="text-gray-700"><span className="font-medium">Reference:</span> {data.payment_reference}</p>
                                    {data.payment_receipt_url && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Payment Receipt:</p>
                                            <img 
                                                src={data.payment_receipt_url} 
                                                alt="Payment Receipt" 
                                                className="max-w-xs border rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {data.remarks && (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Remarks</h3>
                                    <p className="text-gray-700">{data.remarks}</p>
                                </div>
                            )}

                            {data.status === 'Pending' && data.availableStock < data.quantity && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm font-medium">
                                        ⚠️ Insufficient stock: {data.availableStock} available, {data.quantity} requested
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Decline Modal */}
                    {showDeclineModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4">Decline Request</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for decline *
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
                                        onClick={() => handleDecline(data.id)}
                                        disabled={isProcessing}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-red-400"
                                    >
                                        {isProcessing ? 'Processing...' : 'Decline Request'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeclineModal(false);
                                            setDeclineReason('');
                                        }}
                                        disabled={isProcessing}
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
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                            <option value="Damaged">Damaged</option>
                                            <option value="Lost">Lost</option>
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
                                        onClick={() => handleMarkReturned(data.id)}
                                        disabled={isProcessing}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400"
                                    >
                                        {isProcessing ? 'Processing...' : 'Mark as Returned'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReturnModal(false);
                                            setReturnNotes('');
                                            setReturnCondition('Good');
                                        }}
                                        disabled={isProcessing}
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
