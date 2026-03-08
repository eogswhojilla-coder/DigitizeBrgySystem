import React, { useState, useEffect } from 'react';
import { EyeIcon, CheckIcon, XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Table from '@/app/_components/table';
import Button from '@/app/_components/button';
import Badge from '@/app/_components/badge';
import Swal from 'sweetalert2';
import { Image } from 'antd';

export default function CertificateRequestSection() {
    const [requests, setRequests] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchCertificateRequests();
    }, []);

    const fetchCertificateRequests = async () => {
        try {
            const response = await axios.get('/api/admin/certificate-requests');
            // Handle paginated response
            setRequests(response.data.data || response.data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
            console.error('Failed to fetch certificate requests');
            setRequests([]);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'PENDING_VERIFICATION': 'yellow',
            'VERIFIED': 'blue',
            'APPROVED': 'green',
            'REJECTED': 'red',
            'FOR_RELEASE': 'purple',
            'RELEASED': 'gray'
        };

        return (
            <Badge color={colors[status]}>
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const handleAction = async (requestId, action) => {
        try {
            await axios.patch(`/api/admin/certificate-requests/${requestId}/${action}`);
            fetchCertificateRequests();
        } catch (error) {
            console.error(`Error ${action} request:`, error);
        }
    };

    const handlePrintCertificate = async (requestId) => {
        try {
            const response = await axios.get(`/api/admin/certificate-requests/${requestId}/print`, {
                responseType: 'blob'
            });
            
            // Create a blob URL and open in new tab
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            
            // Clean up
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
            
            // Refresh requests
            fetchCertificateRequests();
        } catch (error) {
            console.error("Error printing certificate:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to print certificate. Please try again.",
            });
        }
    };

    const columns = [
        { 
            header: 'Request No.', 
            accessor: 'request_number',
            cell: (row) => row.request_number || `REQ-${row.id}`
        },
        { 
            header: 'Resident Name',
            accessor: 'user',
            cell: (row) => {
                const user = row.user;
                if (!user) return 'N/A';
                return user.first_name 
                    ? `${user.first_name} ${user.middle_name || ''} ${user.last_name || ''}`.trim()
                    : user.name || 'N/A';
            }
        },
        { 
            header: 'Certificate Type',
            accessor: 'certificate_type.name',
            cell: (row) => row.certificate_type?.name || 'N/A'
        },
        { 
            header: 'Date Requested',
            accessor: 'created_at',
            cell: (row) => new Date(row.created_at).toLocaleDateString()
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => getStatusBadge(row.status)
        },
        {
            header: 'Actions',
            accessor: 'actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        onClick={() => {
                            setSelectedRequest(row);
                            setIsViewModalOpen(true);
                        }}
                        variant="secondary"
                        size="sm"
                    >
                        <EyeIcon className="h-4 w-4" />
                    </Button>
                    {row.status === 'PENDING_VERIFICATION' && (
                        <Button
                            onClick={() => handleAction(row.id, 'verify')}
                            variant="success"
                            size="sm"
                            title="Verify Request"
                        >
                            <CheckIcon className="h-4 w-4" />
                        </Button>
                    )}
                    {row.status === 'VERIFIED' && (
                        <>
                            <Button
                                onClick={() => handleAction(row.id, 'approve')}
                                variant="success"
                                size="sm"
                                title="Approve Request"
                            >
                                <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => handleAction(row.id, 'reject')}
                                variant="danger"
                                size="sm"
                                title="Reject Request"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    {(row.status === 'APPROVED' || row.status === 'FOR_RELEASE' || row.status === 'RELEASED') && (
                        <Button
                            onClick={() => handlePrintCertificate(row.id)}
                            variant="primary"
                            size="sm"
                            title="Print Certificate"
                        >
                            <PrinterIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Certificate Requests</h2>
            </div>

            <Table
                columns={columns}
                data={requests}
            />

            {/* View Modal */}
            {isViewModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Certificate Request Details
                            </h3>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Request Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Request Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Request Number</label>
                                        <p className="text-gray-900 font-medium">{selectedRequest.request_number || `REQ-${selectedRequest.id}`}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date Requested</label>
                                        <p className="text-gray-900">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Certificate Type</label>
                                        <p className="text-gray-900">{selectedRequest.certificate_type?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resident Information */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Resident Information</h4>
                                <div className="flex items-start gap-4">
                                    {selectedRequest.user?.resident?.profileImage && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={selectedRequest.user.resident.profileImage.startsWith('data:') 
                                                    ? selectedRequest.user.resident.profileImage 
                                                    : `/images/residents/${selectedRequest.user.resident.profileImage}`}
                                                alt="Resident Photo"
                                                className="!w-24 !h-24 object-cover rounded-lg"
                                                style={{ objectFit: 'cover', width: '96px', height: '96px' }}
                                            />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Full Name</label>
                                            <p className="text-gray-900 font-medium">
                                                {selectedRequest.user?.first_name 
                                                    ? `${selectedRequest.user.first_name} ${selectedRequest.user.middle_name || ''} ${selectedRequest.user.last_name || ''}`.trim()
                                                    : selectedRequest.user?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Email</label>
                                            <p className="text-gray-900">{selectedRequest.user?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Contact Number</label>
                                            <p className="text-gray-900">{selectedRequest.user?.contact || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Username</label>
                                            <p className="text-gray-900">{selectedRequest.user?.username || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Purpose</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.purpose}</p>
                            </div>

                            {/* Valid ID */}
                            {selectedRequest.valid_id_path && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Valid ID Submitted</label>
                                    <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                                        {selectedRequest.valid_id_path.startsWith('data:') || !selectedRequest.valid_id_path.endsWith('.pdf') ? (
                                            <img
                                                src={selectedRequest.valid_id_path.startsWith('data:') ? selectedRequest.valid_id_path : `/storage/${selectedRequest.valid_id_path}`}
                                                alt="Valid ID"
                                                className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90"
                                            />
                                        ) : (
                                            <a
                                                href={`/storage/${selectedRequest.valid_id_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"/>
                                                    <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                                                </svg>
                                                View PDF Document
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Remarks */}
                            {selectedRequest.remarks && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Admin Remarks</label>
                                    <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{selectedRequest.remarks}</p>
                                </div>
                            )}

                            {/* Action History */}
                            {(selectedRequest.verified_at || selectedRequest.approved_at || selectedRequest.rejected_at) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Action History</h4>
                                    <div className="space-y-2">
                                        {selectedRequest.verified_at && (
                                            <p className="text-sm text-gray-700">
                                                <strong>Verified:</strong> {new Date(selectedRequest.verified_at).toLocaleString()} 
                                                {selectedRequest.verified_by && ` by ${selectedRequest.verifiedBy?.name || 'Admin'}`}
                                            </p>
                                        )}
                                        {selectedRequest.approved_at && (
                                            <p className="text-sm text-gray-700">
                                                <strong>Approved:</strong> {new Date(selectedRequest.approved_at).toLocaleString()}
                                                {selectedRequest.approved_by && ` by ${selectedRequest.approvedBy?.name || 'Admin'}`}
                                            </p>
                                        )}
                                        {selectedRequest.rejected_at && (
                                            <p className="text-sm text-gray-700">
                                                <strong>Rejected:</strong> {new Date(selectedRequest.rejected_at).toLocaleString()}
                                                {selectedRequest.rejected_by && ` by ${selectedRequest.rejectedBy?.name || 'Admin'}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setIsViewModalOpen(false)}
                            >
                                Close
                            </Button>
                            
                            {selectedRequest.status === 'PENDING_VERIFICATION' && (
                                <Button
                                    variant="success"
                                    onClick={() => {
                                        handleAction(selectedRequest.id, 'verify');
                                        setIsViewModalOpen(false);
                                    }}
                                >
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    Verify Request
                                </Button>
                            )}

                            {selectedRequest.status === 'VERIFIED' && (
                                <>
                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            handleAction(selectedRequest.id, 'approve');
                                            setIsViewModalOpen(false);
                                        }}
                                    >
                                        <CheckIcon className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            handleAction(selectedRequest.id, 'reject');
                                            setIsViewModalOpen(false);
                                        }}
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </>
                            )}

                            {(selectedRequest.status === 'APPROVED' || selectedRequest.status === 'FOR_RELEASE' || selectedRequest.status === 'RELEASED') && (
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        handlePrintCertificate(selectedRequest.id);
                                    }}
                                >
                                    <PrinterIcon className="h-4 w-4 mr-2" />
                                    Print Certificate
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}