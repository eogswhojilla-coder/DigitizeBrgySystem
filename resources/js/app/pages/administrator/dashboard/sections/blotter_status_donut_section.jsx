// resources/js/app/pages/administrator/dashboard/sections/blotter_status_donut_section.jsx

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartCardSection from './chart_card_section';
import { Shield } from 'lucide-react';
import { blotterStatusData } from './dummy_data';

export default function BlotterStatusDonutSection() {
    return (
        <ChartCardSection
            title="Blotter Status"
            subtitle="Case resolution tracking"
            icon={<Shield className="w-5 h-5 text-red-600" />}
        >
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={blotterStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {blotterStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCardSection>
    );
}