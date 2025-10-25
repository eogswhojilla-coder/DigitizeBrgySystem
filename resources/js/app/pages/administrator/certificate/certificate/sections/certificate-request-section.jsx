import React, { useState, useEffect } from 'react';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Table from '@/app/_components/table';
import Button from '@/app/_components/button';
import Badge from '@/app/_components/badge';

export default function CertificateRequestSection() {
    const [requests, setRequests] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchCertificateRequests();
    }, []);

    const fetchCertificateRequests = async () => {
        try {
            const response = await axios.get('/api/certificate-requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
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
            await axios.patch(`/api/certificate-requests/${requestId}/${action}`);
            fetchCertificateRequests();
        } catch (error) {
            console.error(`Error ${action} request:`, error);
        }
    };

    const columns = [
        { 
            header: 'Request No.', 
            accessor: 'request_number' 
        },
        { 
            header: 'Resident',
            accessor: 'user.name'
        },
        { 
            header: 'Certificate Type',
            accessor: 'certificate_type.name'
        },
        { 
            header: 'Purpose',
            accessor: 'purpose'
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
                            >
                                <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => handleAction(row.id, 'reject')}
                                variant="danger"
                                size="sm"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </Button>
                        </>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">
                            Request Details
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Request Number
                                    </label>
                                    <p>{selectedRequest.request_number}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Status
                                    </label>
                                    <div>{getStatusBadge(selectedRequest.status)}</div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Purpose
                                </label>
                                <p className="mt-1">{selectedRequest.purpose}</p>
                            </div>

                            {selectedRequest.remarks && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Remarks
                                    </label>
                                    <p className="mt-1">{selectedRequest.remarks}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setIsViewModalOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}