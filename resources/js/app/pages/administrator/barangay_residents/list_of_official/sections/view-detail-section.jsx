import React from 'react';
import { User, MapPin, Home, Users, Phone, Calendar, Award } from 'lucide-react';
import moment from 'moment';
import Modal from '@/app/_components/modal';

export default function ViewDetailSection({ isOpen, onClose, official }) {
    if (!official) return null;

    const imageUrl = official.profileImage 
        ? (official.profileImage.startsWith('data:') ? official.profileImage : `/images/residents/${official.profileImage}`) 
        : null;

    const age = official.dateOfBirth 
        ? moment().diff(moment(official.dateOfBirth, "YYYY-MM-DD"), "years")
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

    // Get position color
    const getPositionColor = (position) => {
        const pos = position?.toUpperCase() || '';
        if (pos.includes('CHAIRMAN') || pos.includes('CAPTAIN')) return 'bg-red-600';
        if (pos.includes('KAGAWAD')) return 'bg-green-500';
        if (pos.includes('SK')) return 'bg-green-400';
        if (pos.includes('SECRETARY')) return 'bg-purple-500';
        if (pos.includes('TREASURER')) return 'bg-blue-500';
        return 'bg-gray-500';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="max-w-5xl">
            <div className="flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 -m-6 mb-6 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold">Barangay Official Details</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Official ID: RN-{official.residentId || "N/A"}
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
                                            alt={`${official.firstName} ${official.lastName}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `<span class="text-gray-600 text-4xl font-semibold">${official.firstName?.charAt(0)}${official.lastName?.charAt(0)}</span>`;
                                            }}
                                        />
                                    ) : (
                                        <span className="text-gray-600 text-4xl font-semibold">
                                            {official.firstName?.charAt(0)}{official.lastName?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {official.firstName} {official.middleName} {official.lastName} {official.suffix}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPositionColor(official.position)}`}>
                                        {official.position || 'Barangay Official'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        official.voters === "yes" || official.voters === "registered"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}>
                                        {official.voters === "yes" || official.voters === "registered" ? "Registered Voter" : "Non-Voter"}
                                    </span>
                                    {official.pwd === "yes" && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            PWD
                                        </span>
                                    )}
                                    {official.singleParent === "yes" && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                            Single Parent
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
                                        <p className="text-lg font-semibold text-gray-900">{official.gender || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Civil Status</p>
                                        <p className="text-lg font-semibold text-gray-900">{official.civilStatus || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Status</p>
                                        <p className="text-lg font-semibold text-green-600">ACTIVE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Official Information */}
                        <div className="bg-white border border-blue-200 rounded-lg p-5">
                            <SectionTitle icon={Award} title="Official Information" />
                            <InfoItem label="Position" value={official.position} />
                            <InfoItem label="Start Date" value={official.startDate ? moment(official.startDate).format("MMMM DD, YYYY") : "N/A"} />
                            <InfoItem label="End Date" value={official.endDate ? moment(official.endDate).format("MMMM DD, YYYY") : "N/A"} />
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={User} title="Personal Information" />
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="Date of Birth" value={official.dateOfBirth ? moment(official.dateOfBirth).format("MMMM DD, YYYY") : "N/A"} />
                                <InfoItem label="Place of Birth" value={official.placeOfBirth} />
                                <InfoItem label="Religion" value={official.religion} />
                                <InfoItem label="Nationality" value={official.nationality} />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={Phone} title="Contact Information" />
                            <InfoItem label="Contact Number" value={official.contactNumber} />
                            <InfoItem label="Email Address" value={official.emailAddress} />
                        </div>

                        {/* Address Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={MapPin} title="Address Information" />
                            <InfoItem label="Complete Address" value={official.address} />
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="House Number" value={official.houseNumber} />
                                <InfoItem label="Street" value={official.street} />
                                <InfoItem label="Zone" value={official.zone} />
                                <InfoItem label="Barangay" value={official.barangay} />
                                <InfoItem label="Municipality" value={official.municipality} />
                                <InfoItem label="Province" value={official.province} />
                                <InfoItem label="ZIP Code" value={official.zip} />
                            </div>
                        </div>

                        {/* Residency Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={Home} title="Residency Information" />
                            <InfoItem label="Residency Status" value={official.residencyStatus} />
                            {official.residencyStatusOther && (
                                <InfoItem label="Other Status" value={official.residencyStatusOther} />
                            )}
                            <InfoItem label="Resident Type" value={official.residentType} />
                            <InfoItem label="Date Started Living" value={official.dateStartedLiving ? moment(official.dateStartedLiving).format("MMMM DD, YYYY") : "N/A"} />
                            <InfoItem label="Permanent Address" value={official.address} />
                        </div>

                        {/* Family/Guardian Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <SectionTitle icon={Users} title="Family Information" />
                            <InfoItem label="Father's Name" value={official.fatherName} />
                            <InfoItem label="Mother's Name" value={official.motherName} />
                            <InfoItem label="Guardian's Name" value={official.guardianName} />
                            <InfoItem label="Guardian's Contact" value={official.guardianContact} />
                        </div>
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
