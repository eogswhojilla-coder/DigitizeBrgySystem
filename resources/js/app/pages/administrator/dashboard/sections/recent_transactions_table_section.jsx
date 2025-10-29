// resources/js/app/pages/administrator/dashboard/sections/recent_transactions_table_section.jsx

import React from 'react';
import ChartCardSection from './chart_card_section';
import { FileText, ExternalLink } from 'lucide-react';
import { recentTransactions } from './dummy_data';

export default function RecentTransactionsTableSection() {
    return (
        <ChartCardSection
            title="Recent Transactions"
            subtitle="Latest inventory movements"
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            action={
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    View All
                    <ExternalLink className="w-4 h-4" />
                </button>
            }
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Item</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Borrower</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Qty</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map((transaction) => (
                            <tr 
                                key={transaction.id} 
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-2 text-sm text-gray-900 font-medium">
                                    {transaction.item}
                                </td>
                                <td className="py-3 px-2 text-sm text-gray-700">
                                    {transaction.borrower}
                                </td>
                                <td className="py-3 px-2 text-sm text-gray-500">
                                    {transaction.date}
                                </td>
                                <td className="py-3 px-2 text-sm text-gray-700">
                                    {transaction.quantity}
                                </td>
                                <td className="py-3 px-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        transaction.status === 'Borrowed'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {transaction.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ChartCardSection>
    );
}