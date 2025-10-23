import React from 'react';


export default function Card({ icon, label, value, color }) {

    function set_color() {
        switch (color) {
            case 'success':
                return {
                    card: 'bg-green-50 border-green-200',
                    text: 'text-green-600',
                    iconBg: 'bg-green-100 text-green-700'
                };
            case 'warning':
                return {
                    card: 'bg-yellow-50 border-yellow-200',
                    text: 'text-yellow-600',
                    iconBg: 'bg-yellow-100 text-yellow-700'
                };
            case 'danger':
                return {
                    card: 'bg-red-50 border-red-200',
                    text: 'text-red-600',
                    iconBg: 'bg-red-100 text-red-700'
                };
            case 'orange':
                return {
                    card: 'bg-orange-100 border-orange-200',
                    text: 'text-orange-600',
                    iconBg: 'bg-orange-100 text-orange-700'
                };
            case 'primary':
            default:
                return {
                    card: 'bg-blue-50 border-blue-200',
                    text: 'text-blue-600',
                    iconBg: 'bg-blue-100 text-blue-700'
                };
        }
    }

    const colors = set_color();

    return (
        <div className={`p-4 rounded-lg border ${colors.card}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${colors.text}`}>{label}</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
                </div>
                <div className={`p-2 rounded-full ${colors.iconBg}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
