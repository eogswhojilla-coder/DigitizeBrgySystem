import { Download, TrendingDown, AlertTriangle, Clock, Wrench, History } from 'lucide-react';
import React, { useMemo } from 'react';
import InventoryPDFSection from './inventory-pdf-section';
import InventoryExcelSection from './inventory-excel-section';

export default function InventoryTableSection({ inventories = [], reportType = 'most-borrowed' }) {
    
    // Calculate different report data based on reportType
    const reportData = useMemo(() => {
        if (!Array.isArray(inventories) || inventories.length === 0) {
            return [];
        }

        switch (reportType) {
            case 'most-borrowed':
                // Sort by times borrowed (if you have that field)
                return [...inventories]
                    .sort((a, b) => (b.borrowed || 0) - (a.borrowed || 0))
                    .slice(0, 10);
            
            case 'low-stock':
                // Filter items where stock is below minimum or 0
                return inventories.filter(item => 
                    item.quantity <= (item.minimum_quantity || 5)
                );
            
            case 'overdue':
                // Filter overdue items (you'll need to add this logic based on your data)
                return inventories.filter(item => 
                    item.status === 'overdue' || item.overdue_returns > 0
                );
            
            case 'damaged':
                // Filter damaged items
                return inventories.filter(item => 
                    item.damaged > 0 || item.condition === 'damaged'
                );
            
            case 'borrow-history':
                // Show all items with borrow history
                return inventories;
            
            default:
                return inventories;
        }
    }, [inventories, reportType]);

    // Get report title and icon based on type
    const getReportTitle = () => {
        switch (reportType) {
            case 'most-borrowed':
                return { title: 'Most Borrowed Items', icon: TrendingDown };
            case 'low-stock':
                return { title: 'Low Stock Items', icon: AlertTriangle };
            case 'overdue':
                return { title: 'Overdue Returns', icon: Clock };
            case 'damaged':
                return { title: 'Damaged Items', icon: Wrench };
            case 'borrow-history':
                return { title: 'Borrow History', icon: History };
            default:
                return { title: 'Inventory Report', icon: TrendingDown };
        }
    };

    const { title, icon: Icon } = getReportTitle();

    return (
        <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {title}
                </h3>
                <div className="flex gap-2">
                    <InventoryPDFSection data={reportData} reportType={reportType} />
                    <InventoryExcelSection data={reportData} reportType={reportType} />
                </div>
            </div>

            {reportData.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                    <Icon className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
                    <p className="text-gray-700 font-medium">No data available for this report</p>
                    <p className="text-sm text-gray-500 mt-1">Add inventory items to see reports</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Item Name
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Category
                                    </th>
                                    {reportType === 'most-borrowed' && (
                                        <>
                                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Times Borrowed
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Current Stock
                                            </th>
                                        </>
                                    )}
                                    {reportType === 'low-stock' && (
                                        <>
                                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Current Stock
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Minimum Stock
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Status
                                            </th>
                                        </>
                                    )}
                                    {reportType === 'damaged' && (
                                        <>
                                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Damaged Quantity
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Total Stock
                                            </th>
                                        </>
                                    )}
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Location
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                                            {item.item_name || item.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                            {item.category || 'N/A'}
                                        </td>
                                        {reportType === 'most-borrowed' && (
                                            <>
                                                <td className="border border-gray-300 px-4 py-3 font-semibold text-blue-600">
                                                    {item.borrowed || 0}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                                    {item.quantity || 0}
                                                </td>
                                            </>
                                        )}
                                        {reportType === 'low-stock' && (
                                            <>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <span className="font-semibold text-red-600">
                                                        {item.quantity || 0}
                                                    </span>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                                    {item.minimum_quantity || 5}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Low Stock
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        {reportType === 'damaged' && (
                                            <>
                                                <td className="border border-gray-300 px-4 py-3 font-semibold text-red-600">
                                                    {item.damaged || 0}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                                    {item.quantity || 0}
                                                </td>
                                            </>
                                        )}
                                        <td className="border border-gray-300 px-4 py-3 text-gray-600">
                                            {item.location || 'Storage'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
