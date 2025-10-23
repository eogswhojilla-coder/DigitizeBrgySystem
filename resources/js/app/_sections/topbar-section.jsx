import React from "react";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "../redux/app-slice";
import {
    Bars3Icon,
    BellIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import NotificationSection from "./notification-section";
import SearchSection from "./search-section";
import HeaderMenuSection from "./header-menu-section";

export default function TopbarSection({ userNavigation }) {
    const dispatch = useDispatch();

    return (
        <div className="sticky top-0 z-40 lg:mx-auto w-full  lg:px-0">
            <div className="flex h-16 items-center gap-x-4 border-b shadow-md border-gray-300 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                <button
                    type="button"
                    onClick={() => dispatch(setSidebarOpen(true))}
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                {/* Separator */}
                <div
                    aria-hidden="true"
                    className="h-6 w-px bg-gray-200 lg:hidden"
                />

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 px-8">
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <SearchSection />
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* Separator */}
                            <div
                                aria-hidden="true"
                                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                            />

                            {/* Profile dropdown */}
                            {/* <Menu as="div" className="relative">
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <MenuItem>
                                        <Link
                                            method="post"
                                            as="button"
                                            href={route("logout")}
                                            className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                                        >
                                            Logout
                                        </Link>
                                    </MenuItem>
                                </MenuItems>
                            </Menu> */}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        <NotificationSection />
                        <HeaderMenuSection userNavigation={userNavigation}/>
                        {/* Profile dropdown */}
                    </div>
                </div>
            </div>
        </div>
    );
}
