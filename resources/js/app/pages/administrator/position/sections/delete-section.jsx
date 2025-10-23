import Button from "@/app/_components/button";
import { get_positions_thunk } from "@/app/redux/position-thunk";
import { delete_positions_service } from "@/app/services/positions-service";
import store from "@/app/store/store";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function DeleteSection({ data }) {
    async function handleDelete() {
        try {
            await delete_positions_service(data.id);
            await store.dispatch(get_positions_thunk());
            toast.success("Position deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("❌ Failed to delete position");
        }
    }
    return (
        <Button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 text-red-600 border border-red-300 hover:bg-red-50 px-3 py-1.5 text-sm"
        >
            <Trash2 size={14} />
        </Button>
    );
}
