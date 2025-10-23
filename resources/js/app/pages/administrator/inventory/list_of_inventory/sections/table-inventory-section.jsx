import React, { useState } from "react";
import Button from "@/app/_components/button";
import { Plus, Edit, Trash2, Package, Search, Filter } from "lucide-react";
import { useSelector } from "react-redux";
import DeleteSection from "./delete-section";
export default function TableInventorySection() {
    const { inventories } = useSelector((store) => store.inventories);
    const [items, setItems] = useState([
        {
            id: 1,
            name: "Shovel",
            description: "Heavy-duty garden shovel for digging",
            quantity: 5,
            condition: "Good",
            location: "Tool Shed A",
            status: "Active",
            dateAdded: "2024-01-15",
        },
    ]);

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description,
            quantity: item.quantity.toString(),
            condition: item.condition,
            location: item.location,
            status: item.status,
        });
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const handleRetire = (id) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, status: "Retired" } : item
            )
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 border-green-300";
            case "Damaged":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Retired":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getConditionColor = (condition) => {
        switch (condition) {
            case "New":
                return "text-green-600";
            case "Good":
                return "text-blue-600";
            case "Fair":
                return "text-yellow-600";
            case "Poor":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };
    console.log("inventories", inventories);
    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Inventory Items ({inventories.length})
                    </h2>
                </div>

                {inventories.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No items found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {items.length === 0
                                ? "Get started by adding your first item."
                                : "Try adjusting your search or filter."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-blue-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Condition
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventories?.data?.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Added {item.dateAdded}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {item.description ||
                                                    "No description"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.quantity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`text-sm font-medium ${getConditionColor(
                                                    item.condition
                                                )}`}
                                            >
                                                {item.condition}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.location ||
                                                    "Not specified"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>

                                            {item.status !== "Retired" && (
                                                <button
                                                    onClick={() =>
                                                        handleRetire(item.id)
                                                    }
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                    title="Mark as Retired"
                                                ></button>
                                            )}
                                            <DeleteSection data={item} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
