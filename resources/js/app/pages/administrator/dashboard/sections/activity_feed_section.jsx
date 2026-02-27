// resources/js/app/pages/administrator/dashboard/sections/activity_feed_section.jsx

import React from 'react';
import ChartCardSection from './chart_card_section';
import { Activity, User, FileText, Shield, Package, Users } from 'lucide-react';

const iconMap = {
    user: User,
    file: FileText,
    alert: Shield,
    box: Package,
    users: Users
};

const colorMap = {
    user: 'bg-blue-100 text-blue-600',
    file: 'bg-green-100 text-green-600',
    alert: 'bg-red-100 text-red-600',
    box: 'bg-orange-100 text-orange-600',
    users: 'bg-purple-100 text-purple-600'
};

export default function ActivityFeedSection({ data }) {
    return (
        <ChartCardSection
            title="Recent Activity"
            subtitle="Live system updates"
            icon={<Activity className="w-5 h-5 text-green-600" />}
        >
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {data?.map((activity) => {
                    const Icon = iconMap[activity.icon] || Activity;
                    const colorClass = colorMap[activity.icon] || 'bg-gray-100 text-gray-600';

                    return (
                        <div 
                            key={activity.id} 
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium leading-relaxed">
                                    {activity.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {activity.timestamp}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ChartCardSection>
    );
}