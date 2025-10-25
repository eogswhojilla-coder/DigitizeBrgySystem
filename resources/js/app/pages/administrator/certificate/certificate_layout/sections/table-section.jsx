import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { get_certificate_types_service, delete_certificate_type_service } from '@/app/services/certificate-type-service';
import Swal from 'sweetalert2';

export default function TableSection() {
    const [certificateTypes, setCertificateTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCertificateTypes();
    }, []);

    const fetchCertificateTypes = async () => {
        try {
            setLoading(true);
            const data = await get_certificate_types_service();
            setCertificateTypes(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch certificate types');
            setCertificateTypes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await delete_certificate_type_service(id);
                await fetchCertificateTypes();
                
                await Swal.fire(
                    'Deleted!',
                    'Certificate type has been deleted.',
                    'success'
                );
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                'Failed to delete certificate type.',
                'error'
            );
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {certificateTypes.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                No certificate types found
                            </td>
                        </tr>
                    ) : (
                        certificateTypes.map((type) => (
                            <tr key={type.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {type.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {type.description || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₱{parseFloat(type.fee).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(type)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(type.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}