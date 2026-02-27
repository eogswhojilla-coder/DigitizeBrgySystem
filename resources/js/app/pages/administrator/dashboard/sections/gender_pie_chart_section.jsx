// resources/js/app/pages/administrator/dashboard/sections/gender_pie_chart_section.jsx

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartCardSection from './chart_card_section';
import { Users } from 'lucide-react';

export default function GenderPieChartSection({ data }) {
    return (
        <ChartCardSection
            title="Population by Gender"
            subtitle="Current distribution"
            icon={<Users className="w-5 h-5 text-blue-600" />}
        >
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data?.map((entry, index) => (
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