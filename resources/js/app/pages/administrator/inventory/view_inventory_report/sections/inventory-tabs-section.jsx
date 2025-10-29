import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Package,
    FileText,
    Users,
    AlertTriangle,
    TrendingDown,
    Clock,
    Wrench,
    History,
    Download,
    BarChart3
} from 'lucide-react';
import InventoryTableSection from './inventory-table-section';
import InventoryCardsSection from './inventory-cards-section';

export default function InventoryTabsSection() {
    const [selectedReport, setSelectedReport] = useState('most-borrowed');
    
    // Get inventory data from Redux
    const inventoriesState = useSelector((state) => state.inventories);
    const inventories = inventoriesState?.inventories?.data || inventoriesState?.inventories || [];

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Reports</h1>
                    <p className="text-gray-600">Analyze and track your inventory data</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedReport('most-borrowed')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedReport === 'most-borrowed'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4 inline mr-1" />
                            Most Borrowed
                        </button>
                        <button
                            onClick={() => setSelectedReport('low-stock')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedReport === 'low-stock'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            Low Stock
                        </button>
                        <button
                            onClick={() => setSelectedReport('overdue')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedReport === 'overdue'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Clock className="w-4 h-4 inline mr-1" />
                            Overdue Returns
                        </button>
                        <button
                            onClick={() => setSelectedReport('damaged')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedReport === 'damaged'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Wrench className="w-4 h-4 inline mr-1" />
                            Damaged Items
                        </button>
                        <button
                            onClick={() => setSelectedReport('borrow-history')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedReport === 'borrow-history'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <History className="w-4 h-4 inline mr-1" />
                            Borrow History
                        </button>
                    </div>
                </div>
            </div>

            {/* Show different report sections based on selection */}
            {selectedReport === 'most-borrowed' && (
                <>
                    <InventoryCardsSection inventories={inventories} />
                    <InventoryTableSection inventories={inventories} reportType="most-borrowed" />
                </>
            )}
            {selectedReport === 'low-stock' && (
                <InventoryTableSection inventories={inventories} reportType="low-stock" />
            )}
            {selectedReport === 'overdue' && (
                <InventoryTableSection inventories={inventories} reportType="overdue" />
            )}
            {selectedReport === 'damaged' && (
                <InventoryTableSection inventories={inventories} reportType="damaged" />
            )}
            {selectedReport === 'borrow-history' && (
                <InventoryTableSection inventories={inventories} reportType="borrow-history" />
            )}
        </>
    );
}


