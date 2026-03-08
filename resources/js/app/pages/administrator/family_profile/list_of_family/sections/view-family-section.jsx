import React from "react";
import Modal from "@/app/_components/modal";

export default function ViewFamilySection({ family, isOpen, onClose }) {
    if (!isOpen || !family) return null;

    const address = [family?.houseNumber, family?.street, family?.zone]
        .filter(Boolean)
        .join(", ");

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="max-w-5xl">
            {/* Header */}
            <div className="pb-6 border-b">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Family Details
                </h2>
                <p className="text-gray-500 mt-1">
                    Family #{family?.familyNumber ?? "N/A"}
                </p>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pt-6 space-y-8">
                {/* Information Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">
                            Family Information
                        </h3>

                        <div className="space-y-3 text-sm">
                            <InfoRow
                                label="Family Number"
                                value={family?.familyNumber}
                                highlight
                            />
                            <InfoRow
                                label="Head of Family"
                                value={family?.headOfFamily}
                            />
                            <InfoRow label="Address" value={address} />
                        </div>
                    </div>

                    {/* Household Details */}
                    {family?.household && (
                        <div className="bg-gray-100 rounded-xl p-4 sm:p-6   shadow-sm border-l-4 border-blue-500">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                Household Details
                            </h3>

                            <div className="space-y-3 text-sm">
                                <InfoRow
                                    label="Income Bracket"
                                    value={family.household?.incomeBracket}
                                />
                                <InfoRow
                                    label="House Type"
                                    value={family.household?.houseType}
                                />
                                <InfoRow
                                    label="Number of Rooms"
                                    value={family.household?.numberOfRooms}
                                />
                                <InfoRow
                                    label="Toilet Type"
                                    value={family.household?.toiletType}
                                />
                                <InfoRow
                                    label="Waste Disposal"
                                    value={family.household?.wasteDisposal}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Members Table */}
                {family?.members?.length > 0 && (
                    <div className=" rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4  border-b bg-gray-100">
                            <h3 className="text-lg font-semibold text-blue-800 ">
                                Family Members ({family.members.length})
                            </h3>
                        </div>

                        <div className=" overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b ">
                                    <tr>
                                        <TableHeader>Name</TableHeader>
                                        <TableHeader>Relationship</TableHeader>
                                        <TableHeader>Role</TableHeader>
                                        <TableHeader>Resident ID</TableHeader>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {family.members.map((member, index) => (
                                        <tr
                                            key={member?.id ?? index}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }
                                        >
                                            <TableCell className="font-medium text-gray-900">
                                                {member?.residentName ??
                                                    member?.newResidentName ??
                                                    "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {member?.relationship ?? "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {member?.role ?? "N/A"}
                                            </TableCell>
                                            <TableCell className="font-mono text-blue-600">
                                                {member?.residentId ?? "N/A"}
                                            </TableCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {family?.household?.notes && (
                    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            Notes
                        </h3>
                        <p className="text-sm text-blue-900 leading-relaxed">
                            {family.household.notes}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">{label}:</span>
            <span
                className={`${
                    highlight ? "font-semibold text-gray-900" : "text-gray-800"
                }`}
            >
                {value ?? "N/A"}
            </span>
        </div>
    );
}

function TableHeader({ children }) {
    return <th className="px-6 py-3 text-left font-semibold">{children}</th>;
}

function TableCell({ children, className = "" }) {
    return <td className={`px-6 py-3 ${className}`}>{children}</td>;
}
