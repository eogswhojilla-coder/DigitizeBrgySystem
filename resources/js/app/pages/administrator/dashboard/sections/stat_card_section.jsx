// resources/js/app/pages/administrator/dashboard/sections/stat_card_section.jsx

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCardSection({ icon, title, value, change, trend, color = 'blue' }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600',
        pink: 'bg-pink-50 text-pink-600'
    };

    const isPositive = trend === 'up';
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {typeof value === 'number' && value > 999 
                            ? value.toLocaleString() 
                            : value}
                    </h3>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}>
                            {isPositive ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            <span>{Math.abs(change)}%</span>
                            <span className="text-gray-500 font-normal">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}