import React, { useState } from "react";
import { Edit, Trash2, Package } from "lucide-react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
import DeleteSection from "./delete-section";
import EditSection from "./edit-section";

export default function TableInventorySection() {
    const { inventories } = useSelector((store) => store.inventories);
    const [editingItem, setEditingItem] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowEditForm(true);
    };

    const handleCloseEdit = () => {
        setEditingItem(null);
        setShowEditForm(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 border border-green-300";
            case "Damaged":
                return "bg-yellow-100 text-yellow-800 border border-yellow-300";
            case "Retired":
                return "bg-red-100 text-red-800 border border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-300";
        }
    };

    const getConditionColor = (condition) => {
        switch (condition) {
            case "New":
                return "text-green-600 font-semibold";
            case "Good":
                return "text-blue-600 font-semibold";
            case "Fair":
                return "text-yellow-600 font-semibold";
            case "Poor":
                return "text-red-600 font-semibold";
            default:
                return "text-gray-600";
        }
    };

    const getCategoryBadge = (category) => {
        const colors = {
            Furniture: "bg-purple-100 text-purple-800",
            Equipment: "bg-blue-100 text-blue-800",
            "Event Supplies": "bg-pink-100 text-pink-800",
            "Sports Equipment": "bg-green-100 text-green-800",
            "Office Supplies": "bg-orange-100 text-orange-800",
            "Medical Supplies": "bg-red-100 text-red-800",
            Tools: "bg-gray-100 text-gray-800",
            Electronics: "bg-indigo-100 text-indigo-800",
            Other: "bg-gray-100 text-gray-600",
        };

        return colors[category] || "bg-gray-100 text-gray-600";
    };

    const columns = [
        {
            header: "Item Name",
            accessor: "name",
            cell: (item) => (
                <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                        Added: {new Date(item.created_at).toLocaleDateString()}
                    </div>
                </div>
            ),
        },
        {
            header: "Category",
            accessor: "category",
            cell: (item) => (
                <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getCategoryBadge(
                        item.category
                    )}`}
                >
                    {item.category || "Uncategorized"}
                </span>
            ),
        },
        {
            header: "Description",
            accessor: "description",
            cell: (item) => (
                <div
                    className="text-sm text-gray-700 max-w-xs truncate"
                    title={item.description}
                >
                    {item.description || "No description"}
                </div>
            ),
        },
        {
            header: "Total Stock",
            accessor: "quantity",
            cell: (item) => (
                <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">
                        {item.quantity || 0}
                    </div>
                    <div className="text-xs text-gray-500">
                        Min: {item.minimum_quantity || 5}
                    </div>
                </div>
            ),
        },
        {
            header: "Available",
            accessor: "available",
            cell: (item) => {
                const available = (item.quantity || 0) - (item.borrowed || 0) - (item.damaged || 0);
                const isLow = available <= (item.minimum_quantity || 5);
                return (
                    <div className="text-center">
                        <div className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                            {available}
                        </div>
                        <div className="text-xs text-gray-500">
                            {isLow ? '⚠️ Low' : '✓ Good'}
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Borrowed",
            accessor: "borrowed",
            cell: (item) => (
                <div className="text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.borrowed || 0}
                    </span>
                </div>
            ),
        },
        {
            header: "Damaged",
            accessor: "damaged",
            cell: (item) => (
                <div className="text-center">
                    {item.damaged > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {item.damaged}
                        </span>
                    ) : (
                        <span className="text-gray-400">0</span>
                    )}
                </div>
            ),
        },
        {
            header: "Condition",
            accessor: "condition",
            cell: (item) => (
                <span
                    className={`text-sm ${getConditionColor(item.condition)}`}
                >
                    {item.condition}
                </span>
            ),
        },
        {
            header: "Location",
            accessor: "location",
            cell: (item) => (
                <div className="text-sm text-gray-700">
                    {item.location || "Not specified"}
                </div>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item) => (
                <span
                    className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        item.status
                    )}`}
                >
                    {item.status}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: "actions",
            cell: (item) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                        title="Edit item"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <DeleteSection data={item} />
                </div>
            ),
        },
    ];

    const inventoryData = inventories?.data || inventories || [];

    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Inventory Items
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Total: {inventoryData.length} items
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                                Stock Overview
                            </span>
                        </div>
                    </div>
                </div>

                {inventoryData.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No items found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by adding your first inventory item.
                        </p>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={inventoryData}
                        emptyMessage="No inventory items found. Add your first item to get started."
                    />
                )}
            </div>

            {/* Edit Modal */}
            {showEditForm && editingItem && (
                <EditSection
                    item={editingItem}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    );
}
