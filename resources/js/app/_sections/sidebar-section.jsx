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
                                    >
                                        <span className="sr-only">
                                            Close sidebar
                                        </span>
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
                <div className="flex grow flex-col border-r border-gray-300 bg-white px-1.5 pb-4 shadow-md">
                    <div className="flex h-20 justify-center p-0 w-70  items-center">
                        <img
                            className=" h-auto w-max"
                            src="/images/Blogo.png"
                            alt="Your Company"
                        />
                    </div>
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
