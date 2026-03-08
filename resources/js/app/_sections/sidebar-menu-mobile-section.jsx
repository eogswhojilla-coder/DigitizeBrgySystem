import React from "react";
import DisclosureComponent from "../_components/disclosure";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { FcServices } from "react-icons/fc";
import { Link } from "@inertiajs/react";

export default function SidebarMobileSection({
    navigation,
    setOpenIndex,
    openIndex,
}) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    return (
        <>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-3 pb-4">
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
                        <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                            Barangay II
                        </span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            Management System
                        </span>
                    </div>
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list">
                                {navigation.map((item, i) =>
                                    !item.children ? (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={classNames(
                                                    item.current
                                                        ? "bg-blue-500 text-white"
                                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-500",
                                                    "group flex gap-x-3 rounded-md p-2 py-3 text-sm/6 font-semibold",
                                                )}
                                            >
                                                {/* <item.icon
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        item.current
                                                            ? "text-white"
                                                            : "text-gray-700 group-hover:text-red-500",
                                                        "size-6 shrink-0"
                                                    )}
                                                /> */}
                                                {item.icon}
                                                {item.name}
                                            </Link>
                                        </li>
                                    ) : (
                                        <li key={i}>
                                            <DisclosureComponent
                                                setOpenIndex={setOpenIndex}
                                                openIndex={openIndex}
                                                item={item}
                                                i={i}
                                            />
                                        </li>
                                    ),
                                )}
                            </ul>
                        </li>
                        <li className="mt-auto">
                            <a
                                href="#"
                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-black dark:text-gray-200"
                            >
                                <FcServices className="h-6 w-6" />
                                Settings
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
