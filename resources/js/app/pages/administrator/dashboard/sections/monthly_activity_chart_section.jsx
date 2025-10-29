// resources/js/app/pages/administrator/dashboard/sections/monthly_activity_chart_section.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCardSection from './chart_card_section';
import { Activity } from 'lucide-react';
import { monthlyActivityData } from './dummy_data';

export default function MonthlyActivityChartSection() {
    return (
        <ChartCardSection
            title="Monthly Activity Trends"
            subtitle="Track monthly operations"
            icon={<Activity className="w-5 h-5 text-green-600" />}
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="residents" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name="New Residents"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="blotters" 
                        stroke="#EF4444" 
                        strokeWidth={3}
                        name="Blotter Reports"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="certificates" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="Certificates Issued"
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCardSection>
    );
}