import React, { useState, useEffect } from 'react';
import { Filter, CheckCircle, XCircle, Eye, DollarSign, FileText, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function TableSection() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('PENDING_VERIFICATION');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchCertificateRequests();
    }, []);

    const fetchCertificateRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/certificate-requests');
            // Ensure data is normalized to an array
            const normalizedData = Array.isArray(response.data?.data) 
                ? response.data.data 
                : Array.isArray(response.data) 
                    ? response.data 
                    : [];
            setRequests(normalizedData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch certificate requests');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(request => 
        request.status === selectedFilter
    );

    const getStatusColor = (status) => {
        const colors = {
            'PENDING_VERIFICATION': 'text-yellow-600 bg-yellow-50 border-yellow-200',
            'VERIFIED': 'text-blue-600 bg-blue-50 border-blue-200',
            'APPROVED': 'text-green-600 bg-green-50 border-green-200',
            'REJECTED': 'text-red-600 bg-red-50 border-red-200',
            'FOR_RELEASE': 'text-purple-600 bg-purple-50 border-purple-200',
            'RELEASED': 'text-gray-600 bg-gray-50 border-gray-200'
        };
        return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const badges = {
            'UNPAID': <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Unpaid</span>,
            'FOR_VERIFICATION': <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">For Verification</span>,
            'VERIFIED': <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Verified</span>,
            'PAYMENT_REJECTED': <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Rejected</span>
        };
        return badges[paymentStatus] || badges['UNPAID'];
    };

    const handleViewDetails = async (requestId) => {
        try {
            const response = await axios.get(`/api/admin/certificate-requests/${requestId}`);
            setSelectedRequest(response.data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching request details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load request details'
            });
        }
    };

    const handleVerifyPayment = async (requestId) => {
        const result = await Swal.fire({
            title: 'Verify Payment?',
            text: 'Are you sure you want to verify this payment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, verify it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`/api/admin/certificate-requests/${requestId}/verify-payment`);
                Swal.fire('Verified!', 'Payment has been verified.', 'success');
                fetchCertificateRequests();
                if (selectedRequest?.id === requestId) {
                    handleViewDetails(requestId);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to verify payment'
                });
            }
        }
    };

    const handleRejectPayment = async (requestId) => {
        const { value: remarks } = await Swal.fire({
            title: 'Reject Payment',
            input: 'textarea',
            inputLabel: 'Reason for rejection',
            inputPlaceholder: 'Enter the reason...',
            inputAttributes: {
                'aria-label': 'Enter rejection reason'
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Reject Payment',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to provide a reason!';
                }
            }
        });

        if (remarks) {
            try {
                await axios.patch(`/api/admin/certificate-requests/${requestId}/reject-payment`, { remarks });
                Swal.fire('Rejected!', 'Payment has been rejected.', 'success');
                fetchCertificateRequests();
                if (selectedRequest?.id === requestId) {
                    handleViewDetails(requestId);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to reject payment'
                });
            }
        }
    };

    const handleVerifyRequest = async (requestId) => {
        const result = await Swal.fire({
            title: 'Verify Request?',
            text: 'Verify this certificate request?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, verify it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`/api/admin/certificate-requests/${requestId}/verify`);
                Swal.fire('Verified!', 'Request has been verified.', 'success');
                fetchCertificateRequests();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to verify request'
                });
            }
        }
    };

    const handleApproveRequest = async (requestId) => {
        const result = await Swal.fire({
            title: 'Approve Request?',
            text: 'Are you sure you want to approve this request?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, approve it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`/api/admin/certificate-requests/${requestId}/approve`);
                Swal.fire('Approved!', 'Request has been approved.', 'success');
                fetchCertificateRequests();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to approve request'
                });
            }
        }
    };

    const handleRejectRequest = async (requestId) => {
        const { value: remarks } = await Swal.fire({
            title: 'Reject Request',
            input: 'textarea',
            inputLabel: 'Reason for rejection',
            inputPlaceholder: 'Enter the reason...',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Reject Request',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to provide a reason!';
                }
            }
        });

        if (remarks) {
            try {
                await axios.patch(`/api/admin/certificate-requests/${requestId}/reject`, { remarks });
                Swal.fire('Rejected!', 'Request has been rejected.', 'success');
                fetchCertificateRequests();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to reject request'
                });
            }
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white shadow-sm">
            {/* Filters */}
            <div className="p-4 border-b flex gap-2 overflow-x-auto">
                {[
                    'PENDING_VERIFICATION',
                    'VERIFIED',
                    'APPROVED',
                    'REJECTED',
                    'FOR_RELEASE',
                    'RELEASED'
                ].map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedFilter(status)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                            selectedFilter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        <Filter size={16} />
                        {status.replace('_', ' ')}
                        <span className="bg-opacity-20 bg-white px-2 py-1 rounded-full text-xs">
                            {requests.filter(r => r.status === status).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Resident
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Certificate Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Requested
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                    No certificate requests found
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {request.request_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {request.user?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {request.certificate_type?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {request.certificate_type?.has_fee ? (
                                            <span className="font-semibold text-green-600">
                                                ₱{parseFloat(request.certificate_type.fee).toFixed(2)}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Free</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getPaymentStatusBadge(request.payment_status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                            {request.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewDetails(request.id)}
                                                title="View Details"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {request.status === 'PENDING_VERIFICATION' && (
                                                <button
                                                    onClick={() => handleVerifyRequest(request.id)}
                                                    title="Verify Request"
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {request.status === 'VERIFIED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveRequest(request.id)}
                                                        title="Approve Request"
                                                        className={`hover:text-green-800 ${
                                                            request.certificate_type?.has_fee && request.payment_status !== 'VERIFIED'
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'text-green-600'
                                                        }`}
                                                        disabled={request.certificate_type?.has_fee && request.payment_status !== 'VERIFIED'}
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRequest(request.id)}
                                                        title="Reject Request"
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Request Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 text-gray-900">Request Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Request Number</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.request_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                                            {selectedRequest.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date Requested</p>
                                        <p className="font-medium text-gray-900">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Source</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.source}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resident Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 text-gray-900">Resident Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 text-gray-900">Certificate Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Certificate Type</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.certificate_type?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Purpose</p>
                                        <p className="font-medium text-gray-900">{selectedRequest.purpose}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Fee Amount</p>
                                        <p className="font-medium text-gray-900">
                                            {selectedRequest.certificate_type?.has_fee ? (
                                                <span className="text-green-600">₱{parseFloat(selectedRequest.certificate_type.fee).toFixed(2)}</span>
                                            ) : (
                                                <span>Free</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            {selectedRequest.certificate_type?.has_fee && (
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-blue-600" />
                                        Payment Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Payment Status</p>
                                                <div className="mt-1">{getPaymentStatusBadge(selectedRequest.payment_status)}</div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Payment Method</p>
                                                <p className="font-medium text-gray-900">{selectedRequest.payment_method || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Amount Paid</p>
                                                <p className="font-medium text-gray-900">₱{parseFloat(selectedRequest.amount_paid || 0).toFixed(2)}</p>
                                            </div>
                                            {selectedRequest.payment_verified_by && (
                                                <>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Verified By</p>
                                                        <p className="font-medium text-gray-900">{selectedRequest.payment_verified_by?.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Verified At</p>
                                                        <p className="font-medium text-gray-900">{new Date(selectedRequest.payment_verified_at).toLocaleString()}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Payment Receipt */}
                                        {selectedRequest.receipt_path && (
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-600 mb-2">Payment Receipt</p>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    {selectedRequest.receipt_path.endsWith('.pdf') ? (
                                                        <a
                                                            href={`/storage/${selectedRequest.receipt_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FileText size={20} />
                                                            View PDF Receipt
                                                        </a>
                                                    ) : (
                                                        <img
                                                            src={`/storage/${selectedRequest.receipt_path}`}
                                                            alt="Payment Receipt"
                                                            className="max-w-full h-auto max-h-96 object-contain mx-auto"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment Action Buttons */}
                                        {selectedRequest.payment_status === 'FOR_VERIFICATION' && (
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        handleVerifyPayment(selectedRequest.id);
                                                    }}
                                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={18} />
                                                    Verify Payment
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleRejectPayment(selectedRequest.id);
                                                    }}
                                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={18} />
                                                    Reject Payment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Valid ID */}
                            {selectedRequest.valid_id_path && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Valid ID</h3>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        {selectedRequest.valid_id_path.endsWith('.pdf') ? (
                                            <a
                                                href={`/storage/${selectedRequest.valid_id_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <FileText size={20} />
                                                View PDF Document
                                            </a>
                                        ) : (
                                            <img
                                                src={`/storage/${selectedRequest.valid_id_path}`}
                                                alt="Valid ID"
                                                className="max-w-full h-auto max-h-96 object-contain mx-auto"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Remarks */}
                            {selectedRequest.remarks && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-900">Remarks</h3>
                                    <p className="text-gray-700">{selectedRequest.remarks}</p>
                                </div>
                            )}

                            {/* Request Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                {selectedRequest.status === 'VERIFIED' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleApproveRequest(selectedRequest.id);
                                                setShowDetailsModal(false);
                                            }}
                                            disabled={selectedRequest.certificate_type?.has_fee && selectedRequest.payment_status !== 'VERIFIED'}
                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                                selectedRequest.certificate_type?.has_fee && selectedRequest.payment_status !== 'VERIFIED'
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                        >
                                            <CheckCircle size={18} />
                                            Approve Request
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleRejectRequest(selectedRequest.id);
                                                setShowDetailsModal(false);
                                            }}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={18} />
                                            Reject Request
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}