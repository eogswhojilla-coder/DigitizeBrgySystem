import React, { useState } from "react";
import Layout from "../layout";
import { usePage } from "@inertiajs/react";
import {
    Package,
    FileText,
    Users,
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

export default function Page() {
    const { 
        statsData, 
        genderData, 
        ageGroupData, 
        monthlyActivityData, 
        blotterStatusData, 
        familyDistributionData, 
        inventoryData, 
        recentTransactions, 
        activityFeed 
    } = usePage().props;
    
    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
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
                    {/* <StatCardSection
                        icon={<DollarSign className="w-6 h-6" />}
                        title="Monthly Revenue"
                        value={`₱${(
                            statsData.monthlyRevenue.value / 1000
                        ).toFixed(1)}K`}
                        change={statsData.monthlyRevenue.change}
                        trend={statsData.monthlyRevenue.trend}
                        color="pink"
                    /> */}
                </div>

                {/* Charts Grid - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <MonthlyActivityChartSection data={monthlyActivityData} />
                    <GenderPieChartSection data={genderData} />
                </div>

                {/* Charts Grid - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <AgeGroupBarChartSection data={ageGroupData} />
                    <BlotterStatusDonutSection data={blotterStatusData} />
                    <FamilyStackedBarChartSection data={familyDistributionData} />
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <InventoryProgressSection data={inventoryData} />
                    <RecentTransactionsTableSection data={recentTransactions} />
                    <ActivityFeedSection data={activityFeed} />
                </div>
            </div>
        </Layout>
    );
}
