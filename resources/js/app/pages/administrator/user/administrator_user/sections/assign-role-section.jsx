import React, { useState } from "react";
import { Shield, X } from "lucide-react";
import { assign_role_thunk } from "@/app/redux/administrator-thunk";
import store from "@/app/store/store";
import { usePermissions } from "@/hooks/usePermissions";

export default function AssignRoleSection({ data }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(data.roles?.[0]?.name || "");
    const [isLoading, setIsLoading] = useState(false);
    const { hasPermission } = usePermissions();

    // Only show to Super Admin with roles.manage permission
    const canManageRoles = hasPermission('roles.manage');
    
    if (!canManageRoles) {
        return null;
    }

    const roles = [
        { value: "Super Admin", label: "Super Admin", description: "Full system access" },
        { value: "Admin", label: "Admin", description: "Most features except role management" },
        { value: "Secretary", label: "Secretary", description: "Residents, certificates, announcements" },
        { value: "Treasurer", label: "Treasurer", description: "Payment verification and reports" },
        { value: "Inventory Officer", label: "Inventory Officer", description: "Inventory management only" },
    ];

    const handleOpenModal = () => {
        setSelectedRole(data.roles?.[0]?.name || "");
        setShowModal(true);
    };

    const handleAssignRole = async () => {
        if (!selectedRole) {
            alert("Please select a role");
            return;
        }

        setIsLoading(true);
        try {
            await store.dispatch(
                assign_role_thunk({
                    id: data.id,
                    role: selectedRole,
                })
            );
            setShowModal(false);
        } catch (error) {
            console.error("Error assigning role:", error);
            alert("Failed to assign role");
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleBadgeColor = (roleName) => {
        switch (roleName) {
            case "Super Admin":
                return "bg-purple-100 text-purple-700 border-purple-300";
            case "Admin":
                return "bg-blue-100 text-blue-700 border-blue-300";
            case "Secretary":
                return "bg-green-100 text-green-700 border-green-300";
            case "Treasurer":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "Inventory Officer":
                return "bg-orange-100 text-orange-700 border-orange-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const currentRole = data.roles?.[0]?.name || "No Role";

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title="Assign Role"
            >
                <Shield className="w-4 h-4" />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-purple-600" />
                                Assign Role
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="mb-2">
                                <span className="text-sm font-medium text-gray-700">User:</span>
                                <p className="text-base font-semibold text-gray-900">
                                    {data.first_name} {data.middle_name} {data.last_name}
                                </p>
                            </div>
                            <div className="mb-4">
                                <span className="text-sm font-medium text-gray-700">Current Role:</span>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(currentRole)}`}>
                                        {currentRole}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select New Role:
                            </label>
                            {roles.map((role) => (
                                <label
                                    key={role.value}
                                    className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedRole === role.value
                                            ? "border-purple-600 bg-purple-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role.value}
                                        checked={selectedRole === role.value}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="mt-1 mr-3"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {role.label}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {role.description}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignRole}
                                disabled={isLoading || !selectedRole}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Assigning..." : "Assign Role"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
