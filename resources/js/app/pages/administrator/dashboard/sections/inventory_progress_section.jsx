// resources/js/app/pages/administrator/dashboard/sections/inventory_progress_section.jsx

import React from 'react';
import ChartCardSection from './chart_card_section';
import { Package } from 'lucide-react';

export default function InventoryProgressSection({ data }) {
    return (
        <ChartCardSection
            title="Inventory Status"
            subtitle="Items issued vs remaining"
            icon={<Package className="w-5 h-5 text-orange-600" />}
        >
            <div className="space-y-4">
                {data?.map((item) => (
                    <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-gray-500">
                                {item.issued}/{item.total} issued
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    item.percentage > 70
                                        ? 'bg-red-500'
                                        : item.percentage > 50
                                        ? 'bg-orange-500'
                                        : 'bg-green-500'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Remaining: {item.remaining}</span>
                            <span className="font-medium">{item.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </ChartCardSection>
    );
}