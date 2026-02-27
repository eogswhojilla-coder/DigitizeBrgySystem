// resources/js/app/pages/administrator/dashboard/sections/age_group_bar_chart_section.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCardSection from './chart_card_section';
import { Users } from 'lucide-react';

export default function AgeGroupBarChartSection({ data }) {
    return (
        <ChartCardSection
            title="Population by Age Group"
            subtitle="Age distribution breakdown"
            icon={<Users className="w-5 h-5 text-purple-600" />}
        >
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCardSection>
    );
}