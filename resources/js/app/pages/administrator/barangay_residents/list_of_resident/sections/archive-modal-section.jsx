import React, { useState } from "react";
import { Archive, X } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

export default function ArchiveResidentModal({ resident, onArchiveSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const archiveReasons = [
        { value: "moved_out", label: "Moved out of the barangay" },
        { value: "passed_away", label: "Passed away" },
        { value: "duplicate_entry", label: "Duplicate entry" },
        { value: "lost_jurisdiction", label: "Lost jurisdiction eligibility" },
        { value: "inactive_years", label: "Inactive for many years" },
    ];

    const handleOpen = () => {
        setIsOpen(true);
        setSelectedReason("");
        setNotes("");
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedReason("");
        setNotes("");
    };

    const handleArchive = async () => {
        if (!selectedReason) {
            Swal.fire({
                icon: "warning",
                title: "Select a Reason",
                text: "Please select a reason for archiving this resident.",
            });
            return;
        }

        const confirmed = await Swal.fire({
            title: "Archive Resident?",
            html: `
                <p>Are you sure you want to archive this resident?</p>
                <p class="font-semibold mt-2">${resident.firstName} ${resident.lastName}</p>
                <p class="text-sm text-gray-600 mt-1">Reason: ${
                    archiveReasons.find((r) => r.value === selectedReason)?.label
                }</p>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, archive it",
            cancelButtonText: "Cancel",
        });

        if (!confirmed.isConfirmed) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/archived_residents", {
                resident_id: resident.id,
                archive_reason: selectedReason,
                archive_notes: notes,
            });

            if (response.data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Archived!",
                    text: "Resident has been archived successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                handleClose();
                if (onArchiveSuccess) {
                    onArchiveSuccess();
                }
            } else {
                throw new Error(response.data.message || "Failed to archive resident");
            }
        } catch (error) {
            console.error("Error archiving resident:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || error.message || "Failed to archive resident. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="text-orange-600 hover:text-orange-900 inline-flex items-center"
                title="Archive Resident"
            >
                <Archive className="w-4 h-4" /> 
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Archive Resident
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-4">
                            {/* Resident Info */}
                            <div className="bg-blue-50 p-3 rounded-md">
                                <p className="text-sm text-gray-600">Resident</p>
                                <p className="font-semibold">
                                    {resident.firstName} {resident.middleName}{" "}
                                    {resident.lastName}
                                </p>
                                <p className="text-xs text-gray-600">
                                    ID: {resident.residentId || "N/A"}
                                </p>
                            </div>

                            {/* Archive Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Archive Reason <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedReason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a reason...</option>
                                    {archiveReasons.map((reason) => (
                                        <option key={reason.value} value={reason.value}>
                                            {reason.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Enter any additional information..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Warning Message */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Archived residents will be moved to
                                    the archive section and can be restored if needed.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 p-4 border-t">
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleArchive}
                                disabled={isSubmitting || !selectedReason}
                                className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Archiving...
                                    </>
                                ) : (
                                    <>
                                        <Archive className="w-4 h-4" />
                                        Archive Resident
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
