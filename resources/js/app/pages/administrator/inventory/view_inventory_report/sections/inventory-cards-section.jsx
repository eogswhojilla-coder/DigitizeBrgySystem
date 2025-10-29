import React from 'react';
import { Package, AlertTriangle, Clock, Wrench } from 'lucide-react';

export default function InventoryCardsSection({ inventories = [] }) {
    // Calculate statistics from actual inventory data
    const stats = {
        totalItems: inventories.length,
        lowStock: inventories.filter(item => item.quantity <= (item.minimum_quantity || 5)).length,
        damaged: inventories.filter(item => item.damaged > 0 || item.condition === 'damaged').length,
        borrowed: inventories.reduce((sum, item) => sum + (item.borrowed || 0), 0)
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Items</p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {stats.totalItems}
                        </h3>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                        <Package className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {stats.lowStock}
                        </h3>
                    </div>
                    <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Currently Borrowed</p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {stats.borrowed}
                        </h3>
                    </div>
                    <div className="p-3 rounded-xl bg-green-50 text-green-600">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Damaged Items</p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {stats.damaged}
                        </h3>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 text-red-600">
                        <Wrench className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}
