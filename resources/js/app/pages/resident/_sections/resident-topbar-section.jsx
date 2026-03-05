import React from "react";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "@/app/redux/app-slice";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ResidentHeaderMenuSection from "./resident-header-menu-section";
import NotificationSection from "@/app/_sections/notification-section";

export default function ResidentTopbarSection() {
    const dispatch = useDispatch();

    return (
        <div className="sticky top-0 z-40 lg:mx-auto w-full lg:px-0">
            <div className="flex h-16 items-center gap-x-4 border-b shadow-md px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                <button
                    type="button"
                    onClick={() => dispatch(setSidebarOpen(true))}
                    className="-m-2.5 p-2.5 text-white lg:hidden"
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                {/* Separator */}
                <div
                    aria-hidden="true"
                    className="h-6 w-px bg-blue-400 lg:hidden"
                />

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 px-8">
                    <div className="flex flex-1 items-center">
                        <h1 className="text-lg font-semibold text-white">
                            Resident Portal
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Real-time Notification Bell */}
                        <NotificationSection />
                        
                        {/* User Menu */}
                        <ResidentHeaderMenuSection />
                    </div>
                </div>
            </div>
        </div>
    );
}