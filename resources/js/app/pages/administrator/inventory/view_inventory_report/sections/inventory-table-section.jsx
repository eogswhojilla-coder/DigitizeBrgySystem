import { Download, TrendingDown, AlertTriangle, Clock, Wrench, History } from 'lucide-react';
import React from 'react';
import InventoryPDFSection from './inventory-pdf-section';
import InventoryExcelSection from './inventory-excel-section';

export default function InventoryTableSection({ data = [], reportType = 'most-borrowed', onRefresh }) {
    
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

    // Render table columns based on report type
    const renderTableHeaders = () => {
        switch (reportType) {
            case 'most-borrowed':
                return (
                    <>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Borrowed</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Currently Borrowed</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                    </>
                );
            case 'low-stock':
                return (
                    <>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Current Stock</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Minimum Required</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Shortage</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Alert Level</th>
                    </>
                );
            case 'overdue':
                return (
                    <>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Borrower</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Expected Return</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Days Overdue</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Urgency</th>
                    </>
                );
            case 'damaged':
                return (
                    <>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Damaged Count</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Stock</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Damage %</th>
                    </>
                );
            case 'borrow-history':
                return (
                    <>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Borrower</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Borrowed Date</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Returned Date</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Condition</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </>
                );
            default:
                return null;
        }
    };

    // Render table rows based on report type
    const renderTableRow = (item, index) => {
        switch (reportType) {
            case 'most-borrowed':
                return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.item_name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.category}</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-blue-600">{item.total_borrowed}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.currently_borrowed}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.available_quantity}</td>
                    </tr>
                );
            case 'low-stock':
                return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.item_name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.category}</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-red-600">{item.current_quantity}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.minimum_quantity}</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-orange-600">{item.shortage}</td>
                        <td className="border border-gray-300 px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.alert_level === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {item.alert_level}
                            </span>
                        </td>
                    </tr>
                );
            case 'overdue':
                return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.item_name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.borrower_name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-600">{item.borrower_contact}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.expected_return_date}</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-red-600">{item.days_overdue} days</td>
                        <td className="border border-gray-300 px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                item.urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {item.urgency}
                            </span>
                        </td>
                    </tr>
                );
            case 'damaged':
                return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.item_name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.category}</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-red-600">{item.damaged_count}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.total_quantity}</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-orange-600">{item.damage_percentage}%</td>
                    </tr>
                );
            case 'borrow-history':
                return (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.item_name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.borrower_name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.borrow_date}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.return_date}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-600">{item.duration_days} days</td>
                        <td className="border border-gray-300 px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.condition_after_return === 'Good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {item.condition_after_return}
                            </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.was_late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                                {item.was_late ? `Late (${item.days_late}d)` : 'On Time'}
                            </span>
                        </td>
                    </tr>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {title}
                </h3>
                <div className="flex gap-2">
                    <InventoryPDFSection data={data} reportType={reportType} />
                    <InventoryExcelSection data={data} reportType={reportType} />
                </div>
            </div>

            {data.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                    <Icon className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
                    <p className="text-gray-700 font-medium">No data available for this report</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {reportType === 'borrow-history' 
                            ? 'No completed borrow transactions yet' 
                            : 'Add inventory items to see reports'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    {renderTableHeaders()}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => renderTableRow(item, index))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

