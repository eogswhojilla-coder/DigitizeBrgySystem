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
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-3 pb-4">
                <div className="flex h-16 justify-center p-3  items-center">
                    <img
                        className="h-auto w-max"
                        src="/images/Blogo.png"
                        alt="Your Company"
                    />
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
                                                        : "text-gray-700 hover:bg-gray-50 hover:text-red-500",
                                                    "group flex gap-x-3 rounded-md p-2 py-3 text-sm/6 font-semibold"
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
                                    )
                                )}
                            </ul>
                        </li>
                        <li className="mt-auto">
                            <a
                                href="#"
                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-black"
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
