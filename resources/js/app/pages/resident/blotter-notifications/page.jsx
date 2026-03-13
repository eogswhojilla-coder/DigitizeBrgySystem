// resources/js/app/pages/resident/blotter-notifications/page.jsx

import React, { useState, useEffect } from "react";
import Layout from "../layout";
import {
    Shield,
    AlertTriangle,
    Info,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import axios from "axios";
import moment from "moment";

export default function Page() {
    const [blotterNotifications, setBlotterNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlotterNotifications();
    }, []);

    const fetchBlotterNotifications = async () => {
        try {
            const response = await axios.get("/api/my-blotter-notifications");
            setBlotterNotifications(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching blotter notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "resolved":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolved
                    </span>
                );
            case "ongoing":
            case "pending":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Ongoing
                    </span>
                );
            case "dismissed":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <XCircle className="w-4 h-4 mr-1" />
                        Dismissed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Info className="w-4 h-4 mr-1" />
                        {status || "Unknown"}
                    </span>
                );
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case "high":
                return "border-l-4 border-red-500 bg-red-50";
            case "medium":
                return "border-l-4 border-yellow-500 bg-yellow-50";
            case "low":
                return "border-l-4 border-blue-500 bg-blue-50";
            default:
                return "border-l-4 border-gray-500 bg-gray-50";
        }
    };

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                        Blotter Notifications
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        View blotter reports and notifications related to you
                    </p>
                </div>

                {/* Alert Banner */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-yellow-900">
                                Important Notice
                            </h3>
                            <p className="text-sm text-yellow-800 mt-1">
                                You will be notified here if you are involved in
                                any blotter reports filed in the barangay.
                                Please cooperate with the barangay officials
                                regarding any pending cases.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Loading notifications...
                        </p>
                    </div>
                ) : blotterNotifications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-12 text-center">
                        <Shield className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No blotter notifications
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            You have no pending or active blotter reports
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blotterNotifications.map((blotter) => (
                            <div
                                key={blotter.id}
                                className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 ${getSeverityColor(blotter.severity)}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-xl font-bold text-gray-900">
                                                Blotter Report #
                                                {blotter.case_number ||
                                                    blotter.id}
                                            </h2>
                                            {getStatusBadge(blotter.status)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Filed on:{" "}
                                            {moment(blotter.created_at).format(
                                                "MMMM DD, YYYY hh:mm A",
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">
                                            Complainant
                                        </label>
                                        <p className="text-sm text-gray-900 font-medium mt-1">
                                            {blotter.complainant_name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">
                                            Respondent (You)
                                        </label>
                                        <p className="text-sm text-gray-900 font-medium mt-1">
                                            {blotter.respondent_name
                                                ? blotter.respondent_name
                                                : blotter.respondent
                                                  ? blotter.respondent
                                                  : blotter.respondentResident
                                                    ? `${blotter.respondentResident.firstName} ${blotter.respondentResident.middleName || ""} ${blotter.respondentResident.lastName}`.trim()
                                                    : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">
                                            Incident Type
                                        </label>
                                        <p className="text-sm text-gray-900 font-medium mt-1">
                                            {blotter.incident_type || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">
                                            Incident Date
                                        </label>
                                        <p className="text-sm text-gray-900 font-medium mt-1">
                                            {blotter.incident_date
                                                ? moment(
                                                      blotter.incident_date,
                                                  ).format("MMM DD, YYYY")
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">
                                        Description
                                    </label>
                                    <p className="text-sm text-gray-700 mt-1">
                                        {blotter.description ||
                                            blotter.incident_details ||
                                            "No description provided"}
                                    </p>
                                </div>

                                {blotter.location && (
                                    <div className="mb-4">
                                        <label className="text-xs font-semibold text-gray-600 uppercase">
                                            Incident Location
                                        </label>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {blotter.location}
                                        </p>
                                    </div>
                                )}

                                {blotter.action_taken && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                                        <label className="text-xs font-semibold text-gray-600 uppercase">
                                            Action Taken
                                        </label>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {blotter.action_taken}
                                        </p>
                                    </div>
                                )}

                                {blotter.notes && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                        <label className="text-xs font-semibold text-blue-800 uppercase flex items-center gap-1">
                                            <Info className="w-4 h-4" />
                                            Important Notes
                                        </label>
                                        <p className="text-sm text-blue-900 mt-1">
                                            {blotter.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                        Last updated:{" "}
                                        {moment(blotter.updated_at).format(
                                            "MMMM DD, YYYY hh:mm A",
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
