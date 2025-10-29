// resources/js/app/pages/administrator/dashboard/sections/chart_card_section.jsx

import React from 'react';

export default function ChartCardSection({ title, subtitle, icon, children, action }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="p-2 bg-blue-50 rounded-lg">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        {subtitle && (
                            <p className="text-sm text-gray-500">{subtitle}</p>
                        )}
                    </div>
                </div>
                {action && (
                    <div>{action}</div>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}