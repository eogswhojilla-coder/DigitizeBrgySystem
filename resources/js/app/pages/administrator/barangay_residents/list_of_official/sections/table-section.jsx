import { router } from "@inertiajs/react";
import { Eye, AlertTriangle, X, UserMinus, Trash } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
import SwalAlert from "@/app/_components/swal";
import { toast } from "react-toastify";
import ToastProvider from "@/app/_components/toast";

// SweetAlert-style confirmation modal component
function RemoveOfficialModal({ official, onConfirm, onCancel, isLoading }) {
    if (!official) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={!isLoading ? onCancel : undefined}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-[fadeInScale_0.25s_ease-out]">
                {/* Close button */}
                {!isLoading && (
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Icon area */}
                <div className="flex flex-col items-center pt-10 pb-6 px-8">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
                        <UserMinus className="w-10 h-10 text-red-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Remove Position?
                    </h2>

                    <p className="text-gray-500 text-center text-sm leading-relaxed mb-1">
                        You are about to remove the position of
                    </p>
                    <p className="text-gray-800 font-semibold text-center text-base mb-1">
                        {official.firstName} {official.lastName}
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-medium bg-red-500 mb-4">
                        {official.position}
                    </span>

                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 w-full">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-700 text-xs leading-relaxed">
                            This will revert the official back to a regular
                            resident. This action cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-8 pb-8">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Removing...
                            </>
                        ) : (
                            <>
                                <UserMinus className="w-4 h-4" />
                                Yes, Remove
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.85); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

// Success toast notification
function SuccessToast({ message, onClose }) {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 rounded-xl shadow-xl px-5 py-4 animate-[slideInUp_0.3s_ease-out]">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
            <p className="text-gray-700 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-2 text-gray-400 hover:text-gray-600"
            >
                <X className="w-4 h-4" />
            </button>
            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default function TableSection({ onViewDetails }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [positionFilter, setPositionFilter] = useState("ALL POSITION");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { officials } = useSelector((store) => store.barangay_officials);

    // Modal state
    const [removeModal, setRemoveModal] = useState({
        open: false,
        official: null,
    });
    const [isRemoving, setIsRemoving] = useState(false);
    const [successToast, setSuccessToast] = useState({
        show: false,
        message: "",
    });
    const [localOfficials, setLocalOfficials] = useState(officials?.data || []);

    React.useEffect(() => {
        setLocalOfficials(officials?.data || []);
    }, [officials]);

    // Helper function to get position color
    const getPositionColor = (position) => {
        const pos = position?.toUpperCase() || "";
        if (pos.includes("CHAIRMAN") || pos.includes("CAPTAIN"))
            return "bg-red-600";
        if (pos.includes("KAGAWAD")) return "bg-green-500";
        if (pos.includes("SK")) return "bg-green-400";
        if (pos.includes("SECRETARY")) return "bg-purple-500";
        if (pos.includes("TREASURER")) return "bg-blue-500";
        return "bg-gray-500";
    };

    // ✅ Normalize officials data from API
    const data = Array.isArray(localOfficials)
        ? localOfficials.map((official) => ({
              id: official.id,
              image: official.profileImage
                  ? official.profileImage.startsWith("data:")
                      ? official.profileImage
                      : `/images/residents/${official.profileImage}`
                  : "/api/placeholder/40/40",
              position: official.position || "N/A",
              positionColor: getPositionColor(official.position),
              officialNumber: official.residentId || "N/A",
              name: `${official.firstName || ""} ${official.middleName ? official.middleName.charAt(0) + "." : ""} ${official.lastName || ""}`.trim(),
              pwd: official.pwd === "yes" ? "YES" : "NO",
              singleParent: official.singleParent === "yes" ? "YES" : "NO",
              voters:
                  official.voters === "yes" || official.voters === "registered"
                      ? "YES"
                      : "NO",
              status: "ACTIVE",
              fullData: official,
          }))
        : [];

    // ✅ Safe filtering by search and position
    const filteredOfficials = data.filter((o) => {
        const matchesSearch =
            (o.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.position || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (o.officialNumber || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesPosition =
            positionFilter === "ALL POSITION" || o.position === positionFilter;

        return matchesSearch && matchesPosition;
    });

    // Open remove modal
    const handleRemovePosition = (official) => {
        setRemoveModal({ open: true, official });
    };

    // Confirm remove
    const handleConfirmRemove = async () => {
        const official = removeModal.official;
        setIsRemoving(true);
        try {
            const response = await window.axios.put(
                `/api/barangay_officials/${official.id}/remove-position`,
            );
            if (response.data && response.data.success) {
                setRemoveModal({ open: false, official: null });
                SwalAlert({
                    type: "success",
                    title: "Position Removed",
                    text: "Resident reverted to regular.",
                });
                toast.success(
                    "Position removed successfully. Resident reverted to regular.",
                );
                // Remove from local state
                setLocalOfficials((prev) =>
                    prev.filter((o) => o.id !== official.id),
                );
            } else {
                setRemoveModal({ open: false, official: null });
                SwalAlert({
                    type: "error",
                    title: "Failed",
                    text: response.data.message || "Failed to remove position.",
                });
                toast.error(
                    response.data.message || "Failed to remove position.",
                );
            }
        } catch (error) {
            setRemoveModal({ open: false, official: null });
            SwalAlert({
                type: "error",
                title: "Failed",
                text: "Failed to remove position.",
            });
            toast.error("Failed to remove position.");
        } finally {
            setIsRemoving(false);
        }
    };

    // Cancel remove
    const handleCancelRemove = () => {
        setRemoveModal({ open: false, official: null });
    };

    // Define columns with custom header for position
    const columns = [
        { header: "Image", accessor: "image" },
        {
            header: (
                <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="bg-white/40 border border-gray-600 rounded px-2 py-1 text-xs"
                >
                    <option>ALL POSITION</option>
                    <option>Punong Barangay (Barangay Captain)</option>
                    <option>Barangay Kagawad (Barangay Councilor)</option>

                    <option>Barangay Record Keeper</option>
                    <option>Barangay Nutrition Scholar</option>
                    <option>
                        Lupong Tagapamayapa (Barangay Justice Committee)
                    </option>
                    <option>Barangay Tanod (Barangay Watchman) </option>
                    <option>Barangay Health Worker / Health Officer</option>
                    <option>Barangay Treasurer</option>
                    <option>Barangay Secretary</option>
                    <option>Sangguniang Kabataan (SK) Chairperson</option>
                </select>
            ),
            accessor: "position",
        },
        { header: "Official Number", accessor: "officialNumber" },
        { header: "Name", accessor: "name" },
        { header: "PWD", accessor: "pwd" },
        { header: "Single Parent", accessor: "singleParent" },
        { header: "Voters", accessor: "voters" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];

    // Transform data for table
    const tableData = filteredOfficials.map((official) => ({
        image: (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {official.image &&
                official.image !== "/api/placeholder/40/40" ? (
                    <img
                        src={official.image}
                        alt={official.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-600 text-xs">IMG</span>
                )}
            </div>
        ),
        position: (
            <span
                className={`px-3 py-1 rounded-full text-white text-xs font-medium ${official.positionColor}`}
            >
                {official.position}
            </span>
        ),
        officialNumber: official.officialNumber,
        name: <span className="font-medium">{official.name}</span>,
        pwd: (
            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                {official.pwd}
            </span>
        ),
        singleParent: (
            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                {official.singleParent}
            </span>
        ),
        voters: (
            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                {official.voters}
            </span>
        ),
        status: (
            <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{official.status}</span>
            </div>
        ),
        action: (
            <div className="flex  justify-center">
                <button
                    onClick={() => onViewDetails(official.fullData)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View Details"
                >
                    <Eye className="w-4 h-4" />
                </button>
                {official.position && official.position !== "N/A" && (
                    <button
                        onClick={() => handleRemovePosition(official.fullData)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove Position"
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                )}
            </div>
        ),
    }));

    return (
        <div>
            <ToastProvider />
            <Table columns={columns} data={tableData} />

            {/* SweetAlert-style Remove Modal */}
            {removeModal.open && (
                <RemoveOfficialModal
                    official={removeModal.official}
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                    isLoading={isRemoving}
                />
            )}
        </div>
    );
}
