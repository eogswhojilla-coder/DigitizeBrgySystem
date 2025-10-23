import React, { useState } from 'react'
import {
    Package,
    FileText,
    Users,
    AlertTriangle,
    TrendingDown,
    Clock,
    Wrench,
    History,
    Download,
    BarChart3
} from 'lucide-react';
import Card from '@/app/_components/card';

export default function InventoryCardsSection() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                <Card
                    icon={<Package className="w-8 h-8 text-blue-600" />}
                    label="Total Items"
                    value={100}
                    color="primary"
                />
                <Card
                    icon={
                        <AlertTriangle className="w-8 h-8 text-orange-600" />}
                    label="Low Stock Items"
                    value={100}
                    color="warning"
                />
                <Card
                    icon={
                        <Clock className="w-8 h-8 text-red-600" />}
                    label="Overdue Returns"
                    value={100}
                    color="danger"
                />
                <Card
                    icon={
                        <Wrench className="w-8 h-8 text-yellow-600" />}
                    label="Damaged Items"
                    value={100}
                    color="orange"
                />


            </div>
        </>
    )
}
