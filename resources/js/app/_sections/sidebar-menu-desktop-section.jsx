import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import React from "react";
import DisclosureComponent from "../_components/disclosure";
import { FcServices } from "react-icons/fc";
import { Link } from "@inertiajs/react";

export default function SidebarDesktopSection({
    navigation,
    setOpenIndex,
    openIndex,
}) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }
    return (
        <>
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
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-500",
                                                "group flex gap-x-3 rounded-md p-2 py-3 text-sm/6 font-semibold"
                                            )}
                                        >
                                            
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
                    <li className="mt-auto px-2">
                        <a
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-black"
                        >
                           <FcServices className="h-6 w-6"  />
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );
}
