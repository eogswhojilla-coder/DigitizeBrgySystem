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
    BarChart3,
    DollarSign,
    Shield,
    User,
} from "lucide-react";

// Import dashboard sections
import StatCardSection from "./sections/stat_card_section";
import GenderPieChartSection from "./sections/gender_pie_chart_section";
import AgeGroupBarChartSection from "./sections/age_group_bar_chart_section";
import MonthlyActivityChartSection from "./sections/monthly_activity_chart_section";
import BlotterStatusDonutSection from "./sections/blotter_status_donut_section";
import FamilyStackedBarChartSection from "./sections/family_stacked_bar_chart_section";
import InventoryProgressSection from "./sections/inventory_progress_section";
import RecentTransactionsTableSection from "./sections/recent_transactions_table_section";
import ActivityFeedSection from "./sections/activity_feed_section";
import { statsData } from "./sections/dummy_data";

export default function Page() {
    const [open, setOpen] = useState(false);
    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"></div>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Welcome back! Here's what's happening in your
                            barangay.
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCardSection
                        icon={<Users className="w-6 h-6" />}
                        title="Total Residents"
                        value={statsData.totalResidents.value}
                        change={statsData.totalResidents.change}
                        trend={statsData.totalResidents.trend}
                        color="blue"
                    />
                    <StatCardSection
                        icon={<User className="w-6 h-6" />}
                        title="Total Families"
                        value={statsData.totalFamilies.value}
                        change={statsData.totalFamilies.change}
                        trend={statsData.totalFamilies.trend}
                        color="purple"
                    />
                    <StatCardSection
                        icon={<Shield className="w-6 h-6" />}
                        title="Active Blotters"
                        value={statsData.activeBlotters.value}
                        change={statsData.activeBlotters.change}
                        trend={statsData.activeBlotters.trend}
                        color="red"
                    />
                    <StatCardSection
                        icon={<FileText className="w-6 h-6" />}
                        title="Pending Certificates"
                        value={statsData.pendingCertificates.value}
                        change={statsData.pendingCertificates.change}
                        trend={statsData.pendingCertificates.trend}
                        color="orange"
                    />
                    <StatCardSection
                        icon={<Package className="w-6 h-6" />}
                        title="Inventory Items"
                        value={statsData.inventoryItems.value}
                        change={statsData.inventoryItems.change}
                        trend={statsData.inventoryItems.trend}
                        color="green"
                    />
                    <StatCardSection
                        icon={<DollarSign className="w-6 h-6" />}
                        title="Monthly Revenue"
                        value={`₱${(
                            statsData.monthlyRevenue.value / 1000
                        ).toFixed(1)}K`}
                        change={statsData.monthlyRevenue.change}
                        trend={statsData.monthlyRevenue.trend}
                        color="pink"
                    />
                </div>

                {/* Charts Grid - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MonthlyActivityChartSection />
                    <GenderPieChartSection />
                </div>

                {/* Charts Grid - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AgeGroupBarChartSection />
                    <BlotterStatusDonutSection />
                    <FamilyStackedBarChartSection />
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <InventoryProgressSection />
                    <RecentTransactionsTableSection />
                    <ActivityFeedSection />
                </div>
            </div>
        </Layout>
    );
}
