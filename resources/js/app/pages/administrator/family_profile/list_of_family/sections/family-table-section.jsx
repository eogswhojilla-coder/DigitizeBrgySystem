import React, { useState } from "react";
import { Eye, Trash2, Edit } from "lucide-react";
import ViewFamilySection from "./view-family-section";
import EditFamilySection from "./edit-family-section";
import DeleteFamilySection from "./delete-family-section";

export default function FamilyTableSection({
    families = [],
    loading,
    onDelete,
}) {
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleView = (family) => {
        setSelectedFamily(family);
        setIsViewOpen(true);
    };

    const handleEdit = (family) => {
        setSelectedFamily(family);
        setIsEditOpen(true);
    };

    const handleDelete = (family) => {
        setSelectedFamily(family);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedFamily) {
            onDelete(selectedFamily.id);
            setIsDeleteOpen(false);
            setSelectedFamily(null);
        }
    };

    const closeModals = () => {
        setIsViewOpen(false);
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        setSelectedFamily(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="from-blue-50 to-white">
            <div className="p-3 sm:p-4 md:p-6">
                <div className=" mb-8 overflow-hidden">
                    <div className=" p-2 mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-3xl font-bold">
                            Family Management System
                        </h1>
                        <p className=" mt-2">
                            Manage family records, members, and household
                            details
                        </p>
                    </div>

                    <div className="">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 border-l-4 border-blue-500 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 font-semibold">
                                            Total Families
                                        </p>
                                        <p className="text-2xl sm:text-3xl font-bold text-blue-800">
                                            {families.length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🏠</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 border-l-4 border-green-500 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 font-semibold">
                                            Total Members
                                        </p>
                                        <p className="text-2xl sm:text-3xl font-bold text-green-800">
                                            {families.reduce(
                                                (total, family) =>
                                                    total +
                                                    (family.members?.length ||
                                                        0),
                                                0,
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 border-l-4 border-purple-500 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 font-semibold">
                                            Average Family Size
                                        </p>
                                        <p className="text-2xl sm:text-3xl font-bold text-purple-800">
                                            {families.length > 0
                                                ? Math.round(
                                                      (families.reduce(
                                                          (total, family) =>
                                                              total +
                                                              (family.members
                                                                  ?.length ||
                                                                  0),
                                                          0,
                                                      ) /
                                                          families.length) *
                                                          10,
                                                  ) / 10
                                                : 0}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📈</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-blue-50 border-b border-blue-200 p-3 sm:p-4 md:p-6">
                        <h2 className="text-xl font-bold text-blue-800 flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                            Family Records
                        </h2>
                    </div>

                    {families.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            Family No.
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            Head of Family
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            Members
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            Address
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            Income Bracket
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            House Type
                                        </th>
                                        <th className="px-6 py-4 text-center font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {families.map((family, index) => (
                                        <tr
                                            key={family.id}
                                            className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-blue-25" : "bg-white"}`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-blue-600 font-mono font-semibold">
                                                    {family.familyNumber ||
                                                        "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">
                                                    {family.headOfFamily ||
                                                        "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {family.members?.length ||
                                                        0}{" "}
                                                    member
                                                    {(family.members?.length ||
                                                        0) !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                <div className="text-sm">
                                                    <div>
                                                        {family.houseNumber}{" "}
                                                        {family.street}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {family.zone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {family.household
                                                    ?.incomeBracket || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {family.household?.houseType ||
                                                    "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleView(family)
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200"
                                                        title="View Family Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(family)
                                                        }
                                                        className="text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded-lg transition-all duration-200"
                                                        title="Edit Family"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(family)
                                                        }
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-all duration-200"
                                                        title="Delete Family"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No Families Found
                            </h3>
                            <p className="text-gray-600">
                                Add some families to get started with your
                                family management system.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ViewFamilySection
                family={selectedFamily}
                isOpen={isViewOpen}
                onClose={closeModals}
            />

            <EditFamilySection
                family={selectedFamily}
                isOpen={isEditOpen}
                onClose={closeModals}
            />

            <DeleteFamilySection
                family={selectedFamily}
                isOpen={isDeleteOpen}
                onClose={closeModals}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
