import { Eye, Package } from 'lucide-react'
import React from 'react'
import InventoryTableDetailsSection from './inventory-table-details-section';

export default function InventoryTableSection({ tab, requests }) {
    const filteredRequests = requests.filter(request => request.status === tab);

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
            {filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No {tab.toLowerCase()} requests</h3>
                    <p className="text-gray-600">There are currently no requests with {tab.toLowerCase()} status.</p>
                </div>
            ) : (
                filteredRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between">

                                <InventoryTableDetailsSection
                                    tab={tab}
                                    data={request} />
                            </div>

                            {request.status === 'Pending' && request.availableStock < request.quantity && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm font-medium">
                                        ⚠️ Insufficient stock: {request.availableStock} available, {request.quantity} requested
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
