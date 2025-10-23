import { BellIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FcAdvertising } from "react-icons/fc";

export default function NotificationSection() {
    return (
        <>
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
                <span className="sr-only">View notifications</span>
                <FcAdvertising className="h-6 w-6" />
            </button>
        </>
    );
}
