import React, { useState } from 'react'
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

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedReport('most-borrowed')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedReport === 'most-borrowed'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4 inline mr-1" />
                            Most Borrowed
                        </button>
                        <button
                            onClick={() => setSelectedReport('low-stock')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedReport === 'low-stock'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            Low Stock
                        </button>
                        <button
                            onClick={() => setSelectedReport('overdue')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedReport === 'overdue'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Clock className="w-4 h-4 inline mr-1" />
                            Overdue Returns
                        </button>
                        <button
                            onClick={() => setSelectedReport('damaged')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedReport === 'damaged'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Wrench className="w-4 h-4 inline mr-1" />
                            Damaged Items
                        </button>
                        <button
                            onClick={() => setSelectedReport('borrow-history')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedReport === 'borrow-history'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <History className="w-4 h-4 inline mr-1" />
                            Borrow History
                        </button>
                    </div>
                </div>


                {/* Summary Cards */}

            </div>
            {
                selectedReport == 'most-borrowed' && <>
                    <InventoryTableSection />
                    <InventoryCardsSection />
                </>
            }
            {
                selectedReport == 'low-stock' && <>
                    hhello</>
            }
            {
                selectedReport == 'overdue' && <>
                    waaa</>
            }
        </>
    )
}


