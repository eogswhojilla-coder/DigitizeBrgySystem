import { get_administrator_thunk } from "@/app/redux/administrator-thunk";
import { delete_administrator_service } from "@/app/services/administrator-service";
import store from "@/app/store/store";
import { data } from "autoprefixer";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

export default function DeleteSection({ data }) {
    async function handleDelete() {
        try {
            await delete_administrator_service(data.id);
            await store.dispatch(get_administrator_thunk());
            toast.success("Administrator deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("❌ Failed to delete administrator");
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 inline-flex items-center"
            title="Delete Administrator"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
