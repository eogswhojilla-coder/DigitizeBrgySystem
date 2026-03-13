import React, { useState, useEffect } from "react";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import { User, MapPin, Calendar, FileText, AlertCircle } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { get_blotters_thunk } from "@/app/redux/blotter-thunk";
import { toast } from "react-toastify";

export default function ViewBlotterModal({ isOpen, onClose, blotterId }) {
    const [blotter, setBlotter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [newRemarks, setNewRemarks] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen && blotterId) {
            fetchBlotterDetails();
        }
    }, [isOpen, blotterId]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setBlotter(null);
            setNewStatus("");
            setNewRemarks("");
        }
    }, [isOpen]);

    const fetchBlotterDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/blotters/${blotterId}`);
            setBlotter(response.data);
            setNewStatus(response.data.status || "");
            setNewRemarks(response.data.remarks || "");
        } catch (error) {
            console.error("Error fetching blotter details:", error);
            toast.error("Failed to load blotter details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!newStatus) {
            toast.warning("Please select a status");
            return;
        }

        setUpdating(true);
        try {
            await axios.put(`/api/blotters/${blotterId}`, {
                status: newStatus,
                remarks: newRemarks,
            });

            toast.success("Blotter status updated successfully");
            dispatch(get_blotters_thunk());
            onClose();
        } catch (error) {
            console.error("Error updating blotter:", error);
            toast.error("Failed to update blotter status");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
             width="max-w-3xl"
            title="Blotter Record Details"
        >
            {loading || !blotter ? (
                <div className="p-6 text-center text-gray-500">
                    <p>Loading blotter details...</p>
                </div>
            ) : (
                <>
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                        {/* Blotter Number & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-gray-600">
                                    Blotter Number
                                </label>
                                <p className="text-lg font-bold text-blue-600 mt-1">
                                    {blotter.id
                                        ? `BLT-${String(blotter.id).padStart(6, "0")}`
                                        : "N/A"}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-gray-600">
                                    Current Status
                                </label>
                                <p className="text-lg font-bold text-green-600 mt-1 uppercase">
                                    {blotter.status || "Pending"}
                                </p>
                            </div>
                        </div>

                        {/* Complainant Information */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Complainant Information
                            </h3>
                            <div className="space-y-2">
                                {blotter.complainant_resident && (
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Resident Name:
                                        </label>
                                        <p className="font-medium">
                                            {blotter.complainant_resident}
                                        </p>
                                    </div>
                                )}
                                {blotter.complainant_not_resident && (
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Non-Resident Name:
                                        </label>
                                        <p className="font-medium">
                                            {blotter.complainant_not_resident}
                                        </p>
                                    </div>
                                )}
                                {blotter.complainant_statement && (
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Statement:
                                        </label>
                                        <p className="font-medium text-gray-700 whitespace-pre-wrap">
                                            {blotter.complainant_statement}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Respondent Information */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                Respondent Information
                            </h3>
                            <div className="space-y-2">
                                {blotter.respondent && (
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Name:
                                        </label>
                                        <p className="font-medium">
                                            {blotter.respondent}
                                        </p>
                                    </div>
                                )}
                                {blotter.respondentResident && (
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Registered Resident:
                                        </label>
                                        <p className="font-medium">
                                            {`${blotter.respondentResident.firstName} ${blotter.respondentResident.middleName || ""} ${blotter.respondentResident.lastName}`.trim()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Persons Involved */}
                        {(blotter.person_involved_resident ||
                            blotter.person_involved_not_resident) && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Persons Involved
                                </h3>
                                <div className="space-y-2">
                                    {blotter.person_involved_resident && (
                                        <div>
                                            <label className="text-sm text-gray-600">
                                                Resident:
                                            </label>
                                            <p className="font-medium">
                                                {
                                                    blotter.person_involved_resident
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {blotter.person_involved_not_resident && (
                                        <div>
                                            <label className="text-sm text-gray-600">
                                                Non-Resident:
                                            </label>
                                            <p className="font-medium">
                                                {
                                                    blotter.person_involved_not_resident
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {blotter.person_statement && (
                                        <div>
                                            <label className="text-sm text-gray-600">
                                                Statement:
                                            </label>
                                            <p className="font-medium text-gray-700 whitespace-pre-wrap">
                                                {blotter.person_statement}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Incident Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-orange-600" />
                                Incident Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        Location of Incident:
                                    </label>
                                    <p className="font-medium">
                                        {blotter.location_of_incident || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Date of Incident:
                                    </label>
                                    <p className="font-medium">
                                        {blotter.date_of_incident || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Date Reported:
                                    </label>
                                    <p className="font-medium">
                                        {blotter.date_reported || "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="text-sm text-gray-600">
                                    Incident Description:
                                </label>
                                <p className="font-medium text-gray-700 whitespace-pre-wrap">
                                    {blotter.incident || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Existing Remarks (read-only display) */}
                        {blotter.remarks && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-gray-600">
                                    Remarks
                                </label>
                                <p className="font-medium text-gray-700 mt-1 whitespace-pre-wrap">
                                    {blotter.remarks}
                                </p>
                            </div>
                        )}

                        {/* Update Status Section */}
                        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                Update Blotter Status
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) =>
                                            setNewStatus(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="under investigation">
                                            Under Investigation
                                        </option>
                                        <option value="resolved">
                                            Resolved
                                        </option>
                                        <option value="dismissed">
                                            Dismissed
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <input
                                        type="text"
                                        value={newRemarks}
                                        onChange={(e) =>
                                            setNewRemarks(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter remarks"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <Button
                            onClick={onClose}
                            variant="secondary"
                            disabled={updating}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleUpdateStatus}
                            variant="primary"
                            disabled={updating || !newStatus}
                        >
                            {updating ? "Updating..." : "Update Status"}
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
}
