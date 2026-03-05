import React from 'react';
import { Search, FileText } from 'lucide-react';

export default function SearchSection({ searchTerm, onSearchChange, totalCount, onGeneratePDF }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <span className="text-gray-700 font-semibold">NUMBER OF OFFICIALS WITH ENDED TERMS</span>
                        <span className="ml-2 bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold">
                            {totalCount}
                        </span>
                    </div>
                    <button
                        onClick={onGeneratePDF}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                        title="Generate PDF Report"
                    >
                        <FileText className="w-4 h-4" />
                        Generate Report PDF
                    </button>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-700 mr-2 font-medium">SEARCH:</span>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                            placeholder="Search by name or position..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

