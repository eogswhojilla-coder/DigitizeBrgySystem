import React from "react";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "@/app/redux/app-slice";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ResidentHeaderMenuSection from "./resident-header-menu-section";
import NotificationSection from "@/app/_sections/notification-section";
import DarkModeToggle from "@/app/_components/dark-mode-toggle";

export default function ResidentTopbarSection() {
    const dispatch = useDispatch();

    return (
        <div className="sticky top-0 z-40 lg:mx-auto w-full lg:px-0 bg-white dark:bg-gray-800">
            <div className="flex h-14 sm:h-16 items-center gap-x-2 sm:gap-x-4 border-b shadow-md px-3 sm:px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                <button
                    type="button"
                    onClick={() => dispatch(setSidebarOpen(true))}
                    className="-m-2.5 p-2.5 text-white lg:hidden"
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon aria-hidden="true" className="size-6 text-black" />
                </button>

                {/* Separator */}
                <div
                    aria-hidden="true"
                    className="h-6 w-px bg-blue-400 lg:hidden"
                />

                <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6 px-2 sm:px-8">
                    <div className="flex flex-1 items-center">
                        <h1 className="text-sm sm:text-lg font-semibold text-blue-900 dark:text-blue-300 tracking-wide">
                            Resident Portal
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
                        {/* Dark Mode Toggle */}
                        <DarkModeToggle />
                        
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