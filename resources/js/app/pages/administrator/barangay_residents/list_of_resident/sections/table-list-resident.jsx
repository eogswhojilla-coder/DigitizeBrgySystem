import React, { useState } from "react";
import { Edit2, X, Search, RotateCcw, Eye, Briefcase } from "lucide-react";
import { useSelector } from "react-redux";
import moment from "moment";
import DeleteSection from "./delete-section";
import ViewDetailSection from "./view-detail.section";
import AssignPositionSection from "./assign-position-section";
import ArchiveModalSection from "./archive-modal-section";
import Table from "@/app/_components/table";
import store from "@/app/store/store";
import { get_barangay_residents_thunk } from "@/app/redux/barangay-resident-thunk";

export default function TableListResident() {
    const { residents } = useSelector((store) => store.barangay_residents);
    const [filters, setFilters] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        voters: "",
        age: "",
        status: "",
        pwd: "",
        singleParent: "",
        senior: "",
        residentNumber: "",
    });
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [isAssignPositionOpen, setIsAssignPositionOpen] = useState(false);

    const handleViewDetails = (resident) => {
        setSelectedResident(resident);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = (value) => {
        setIsViewModalOpen(value);
        if (!value) {
            setSelectedResident(null);
        }
    };

    const handleAssignPosition = (resident) => {
        setSelectedResident(resident);
        setIsAssignPositionOpen(true);
    };

    const handleCloseAssignPosition = (value) => {
        setIsAssignPositionOpen(value);
        if (!value) {
            setSelectedResident(null);
        }
    };

    const handleArchiveSuccess = () => {
        // Refresh the residents list after archiving
        store.dispatch(get_barangay_residents_thunk());
    };

    console.log("residents", residents);

    const columns = [
        {
            header: "Image",
            accessor: "image",
        },
        {
            header: "Resident Number",
            accessor: "residentNumber",
        },
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Age",
            accessor: "age",
        },
        {
            header: "PWD",
            accessor: "pwd",
        },
        {
            header: "Single Parent",
            accessor: "singleParent",
        },
        {
            header: "Voters",
            accessor: "voters",
        },
        {
            header: "Status",
            accessor: "status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

    const tableData =
        residents?.data?.map((resident) => {
            const dob = resident.dateOfBirth;
            const age = moment().diff(moment(dob, "YYYY-MM-DD"), "years");
            const imageUrl = resident.profileImage 
                ? (resident.profileImage.startsWith('data:') ? resident.profileImage : `/images/residents/${resident.profileImage}`) 
                : null;

            return {
                image: (
                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={`${resident.firstName} ${resident.lastName}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<span class="text-gray-600 text-xs font-semibold">${resident.firstName?.charAt(0)}${resident.lastName?.charAt(0)}</span>`;
                                }}
                            />
                        ) : (
                            <span className="text-gray-600 text-xs font-semibold">
                                {resident.firstName?.charAt(0)}{resident.lastName?.charAt(0)}
                            </span>
                        )}
                    </div>
                ),
                residentNumber: <span className="font-mono">RN-{resident.residentId || "N/A"}</span>,
                name: (
                    <span className="font-medium">
                        {resident.firstName} {resident.middleName}{" "}
                        {resident.lastName}
                    </span>
                ),
                age: age || "-",
                pwd: (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        {resident.pwd}
                    </span>
                ),
                singleParent: (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        {resident.singleParent}
                    </span>
                ),
                voters: (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            resident.voters === "YES"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {resident.voters}
                    </span>
                ),
                status: (
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>{resident.status}</span>
                    </div>
                ),
                action: (
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => handleViewDetails(resident)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleAssignPosition(resident)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Assign Position"
                        >
                            <Briefcase className="w-4 h-4" />
                        </button>
                        <ArchiveModalSection 
                            resident={resident}
                            onArchiveSuccess={handleArchiveSuccess}
                        />
                    </div>
                ),
            };
        }) || [];

    return (
        <div>
            <Table columns={columns} data={tableData} />
            <ViewDetailSection 
                isOpen={isViewModalOpen}
                onClose={handleCloseModal}
                resident={selectedResident}
            />
            <AssignPositionSection
                isOpen={isAssignPositionOpen}
                onClose={handleCloseAssignPosition}
                resident={selectedResident}
            />
        </div>
    );
}
