import React, { useState, useEffect } from 'react';
import { Filter, CheckCircle, XCircle, Eye } from 'lucide-react';
import axios from 'axios';

export default function TableSection() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('PENDING_VERIFICATION');

    useEffect(() => {
        fetchCertificateRequests();
    }, []);

    const fetchCertificateRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/certificate-requests');
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
                                Purpose
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
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {request.purpose}
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
                                                title="View Details"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {request.status === 'PENDING_VERIFICATION' && (
                                                <button
                                                    title="Verify Request"
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {request.status === 'VERIFIED' && (
                                                <>
                                                    <button
                                                        title="Approve Request"
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
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
        </div>
    );
}