import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link, usePage } from "@inertiajs/react";
import React from "react";

export default function ResidentHeaderMenuSection({ userNavigation }) {
    const { profile } = usePage().props;

    return (
        <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img 
                    alt="" 
                    src={profile?.profileImage || "/images/admin (1).png"} 
                    className="h-6 w-6 rounded-full object-cover" 
                />
                <span className="hidden lg:flex lg:items-center">
                    <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                    >
                        {profile?.firstName} {profile?.middleName}{" "}
                        {profile?.lastName}
                    </span>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                    />
                </span>
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none transition ease-out duration-100 data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                <MenuItem>
                    <Link
                        href="/resident/profile"
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-200 data-[focus]:bg-gray-50 dark:data-[focus]:bg-gray-700"
                    >
                        Settings
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link
                        method="post"
                        as="button"
                        href={route("logout")}
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-200 data-[focus]:bg-gray-50 dark:data-[focus]:bg-gray-700"
                    >
                        Logout
                    </Link>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}
