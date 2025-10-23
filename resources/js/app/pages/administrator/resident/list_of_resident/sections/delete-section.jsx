"use client";

import store from "@/app/store/store";
import React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { delete_barangay_residents_service } from "@/app/services/barangay-resident-service";
import { get_barangay_residents_thunk } from "@/app/redux/barangay-resident-thunk";

export default function DeleteSection({ data }) {
    async function handleDelete() {
        try {
            await delete_barangay_residents_service(data.id);
            await store.dispatch(get_barangay_residents_thunk());
            toast.success("Resident deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("❌ Failed to delete resident");
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 inline-flex items-center"
            title="Delete Resident"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
