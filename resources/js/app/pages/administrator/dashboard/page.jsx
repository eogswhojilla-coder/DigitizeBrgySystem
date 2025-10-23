import React, { useState } from "react";
import Layout from "../layout";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import { H1Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import TextArea from "@/app/_components/textarea";
import Radio from "@/app/_components/radio";
import Modal from "@/Components/Modal";
import DashboardCardSection from "./sections/dashboard-card-section";
import Card from "@/app/_components/card";
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

export default function Page() {
    const [open, setOpen] = useState(false);
    return (
        <Layout>
            <Button variant="primary" outline>
                click me
            </Button>
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
        </Layout>
    );
}
