import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch report data when report type changes
    useEffect(() => {
        fetchReportData(selectedReport);
    }, [selectedReport]);

    const fetchReportData = async (reportType) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`/api/inventory-reports?type=${reportType}`);
            setReportData(response.data.data || []);
        } catch (error) {
            console.error('Error fetching report data:', error);
            setError('Failed to load report data. Please try again.');
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchReportData(selectedReport);
    };

    return (
        <>
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Inventory Reports</h1>
                    <p className="text-sm sm:text-base text-gray-600">Analyze and track your inventory data</p>
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

                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                    >
                        {loading ? 'Loading...' : 'Refresh Data'}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading report data...</p>
                </div>
            )}

            {/* Show different report sections based on selection */}
            {!loading && (
                <>
                    {selectedReport === 'most-borrowed' && reportData.length > 0 && (
                        <InventoryCardsSection inventories={reportData} />
                    )}
                    <InventoryTableSection 
                        data={reportData} 
                        reportType={selectedReport}
                        onRefresh={handleRefresh}
                    />
                </>
            )}
        </>
    );
}


