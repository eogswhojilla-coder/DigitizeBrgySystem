import { Transition } from "@headlessui/react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState, Fragment } from "react";
import { setSidebarOpen } from "../redux/app-slice";
import { useDispatch, useSelector } from "react-redux";
import DisclosureComponent from "./../_components/disclosure";
import SidebarDesktopSection from "./sidebar-menu-desktop-section";
import SidebarMobileSection from "./sidebar-menu-mobile-section";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function SidebarSection({ navigation }) {
    const { sidebarOpen } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <>
            {/* Mobile sidebar */}
            <Transition show={sidebarOpen} as={Fragment}>
                <div
                    onClick={() => dispatch(setSidebarOpen(false))}
                    className="relative z-50 lg:hidden"
                >
                    {/* Backdrop */}
                    <div>
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </div>

                    {/* Sidebar panel */}
                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition duration-500 ease-out"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition duration-500 ease-in"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="relative mr-16 flex w-full max-w-xs flex-1"
                            >
                                {/* Close button */}
                                <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(setSidebarOpen(false))
                                        }
                                        className="-m-2.5 p-2.5"
                                        aria-label="Close sidebar"
                                    >
                                        <XMarkIcon
                                            className="size-6 text-white"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>

                                {/* Sidebar content */}
                                <SidebarMobileSection
                                    setOpenIndex={setOpenIndex}
                                    openIndex={openIndex}
                                    navigation={navigation}
                                />
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* 
                   Updated: Changed px-1.5 to px-4 to align with header padding 
                   Updated: Added dark:bg-gray-900 to container for consistency 
                */}
                <div className="flex grow flex-col border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-4 shadow-md">
                    {/* Header Section */}
                    <div className="flex items-center gap-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        {/* Logo Container */}
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
                            <img
                                src="/images/brgy-ll-logo.png"
                                alt="Barangay II Logo"
                                className="h-full w-full object-contain p-1"
                            />
                        </div>

                        {/* Text Container */}
                        <div className="flex flex-col leading-tight">
                            <span className="text-base text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Barangay II
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-widest">
                                Management System
                            </span>
                        </div>
                    </div>

                    {/* Menu Section */}
                    <SidebarDesktopSection
                        setOpenIndex={setOpenIndex}
                        openIndex={openIndex}
                        navigation={navigation}
                    />
                </div>
            </div>
        </>
    );
}
