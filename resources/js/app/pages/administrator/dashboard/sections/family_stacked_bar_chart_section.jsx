// resources/js/app/pages/administrator/dashboard/sections/family_stacked_bar_chart_section.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import ChartCardSection from './chart_card_section';
import { Users } from 'lucide-react';

export default function FamilyStackedBarChartSection({ data }) {
    return (
        <ChartCardSection
            title="Special Categories Distribution"
            subtitle="Senior Citizens, PWD, Solo Parents, 4Ps"
            icon={<Users className="w-5 h-5 text-pink-600" />}
        >
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#EC4899" radius={[0, 8, 8, 0]}>
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCardSection>
    );
}