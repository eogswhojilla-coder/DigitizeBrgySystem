import React from 'react';
import { User, MapPin, Home, Users, Phone, Calendar } from 'lucide-react';
import moment from 'moment';
import Modal from '@/app/_components/modal';

export default function ViewDetailSection({ isOpen, onClose, resident }) {
    if (!resident) return null;

    const imageUrl = resident.profileImage 
        ? (resident.profileImage.startsWith('data:') ? resident.profileImage : `/images/residents/${resident.profileImage}`) 
        : null;

    const age = resident.dateOfBirth 
        ? moment().diff(moment(resident.dateOfBirth, "YYYY-MM-DD"), "years")
        : "N/A";

    const InfoItem = ({ label, value }) => (
        <div className="mb-3">
            <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-sm text-gray-900">{value || "N/A"}</p>
        </div>
    );

    const SectionTitle = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <Icon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="max-w-5xl">
            <div className="flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 -m-6 mb-6 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold">Resident Details</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Resident ID: RN-{resident.residentId || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 pr-2">
                    {/* Profile Section */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={`${resident.firstName} ${resident.lastName}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `<span class="text-gray-600 text-4xl font-semibold">${resident.firstName?.charAt(0)}${resident.lastName?.charAt(0)}</span>`;
                                            }}
                                        />
                                    ) : (
                                        <span className="text-gray-600 text-4xl font-semibold">
                                            {resident.firstName?.charAt(0)}{resident.lastName?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {resident.firstName} {resident.middleName} {resident.lastName} {resident.suffix}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        resident.voters === "YES"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}>
                                        {resident.voters === "YES" ? "Registered Voter" : "Non-Voter"}
                                    </span>
                                    {resident.pwd === "YES" && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            PWD
                                        </span>
                                    )}
                                    {resident.singleParent === "YES" && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                            Single Parent
                                        </span>
                                    )}
                                    {resident.isOfficial && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Barangay Official
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Age</p>
                                        <p className="text-lg font-semibold text-gray-900">{age}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Gender</p>
                                        <p className="text-lg font-semibold text-gray-900">{resident.gender || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Civil Status</p>
                                        <p className="text-lg font-semibold text-gray-900">{resident.civilStatus || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Status</p>
                                        <p className="text-lg font-semibold text-green-600">{resident.status || "Active"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={User} title="Personal Information" />
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="Date of Birth" value={resident.dateOfBirth ? moment(resident.dateOfBirth).format("MMMM DD, YYYY") : "N/A"} />
                                <InfoItem label="Place of Birth" value={resident.placeOfBirth} />
                                <InfoItem label="Religion" value={resident.religion} />
                                <InfoItem label="Nationality" value={resident.nationality} />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={Phone} title="Contact Information" />
                            <InfoItem label="Contact Number" value={resident.contactNumber} />
                            <InfoItem label="Email Address" value={resident.emailAddress} />
                        </div>

                        {/* Address Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={MapPin} title="Address Information" />
                            <InfoItem label="Complete Address" value={resident.address} />
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="House Number" value={resident.houseNumber} />
                                <InfoItem label="Street" value={resident.street} />
                                <InfoItem label="Zone" value={resident.zone} />
                                <InfoItem label="Barangay" value={resident.barangay} />
                                <InfoItem label="Municipality" value={resident.municipality} />
                                <InfoItem label="Province" value={resident.province} />
                                <InfoItem label="ZIP Code" value={resident.zip} />
                            </div>
                        </div>

                        {/* Residency Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={Home} title="Residency Information" />
                            <InfoItem label="Residency Status" value={resident.residencyStatus} />
                            {resident.residencyStatusOther && (
                                <InfoItem label="Other Status" value={resident.residencyStatusOther} />
                            )}
                            <InfoItem label="Resident Type" value={resident.residentType} />
                            <InfoItem label="Date Started Living" value={resident.dateStartedLiving ? moment(resident.dateStartedLiving).format("MMMM DD, YYYY") : "N/A"} />
                            <InfoItem label="Permanent Address" value={resident.address} />
                        </div>

                        {/* Family/Guardian Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={Users} title="Family Information" />
                            <InfoItem label="Father's Name" value={resident.fatherName} />
                            <InfoItem label="Mother's Name" value={resident.motherName} />
                            <InfoItem label="Guardian's Name" value={resident.guardianName} />
                            <InfoItem label="Guardian's Contact" value={resident.guardianContact} />
                        </div>

                        {/* Official Information */}
                        {resident.isOfficial && (
                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                <SectionTitle icon={Calendar} title="Official Information" />
                                <InfoItem label="Position" value={resident.position} />
                                <InfoItem label="Start Date" value={resident.startDate ? moment(resident.startDate).format("MMMM DD, YYYY") : "N/A"} />
                                <InfoItem label="End Date" value={resident.endDate ? moment(resident.endDate).format("MMMM DD, YYYY") : "N/A"} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 flex justify-end border-t border-gray-200">
                    <button
                        onClick={() => onClose(false)}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
