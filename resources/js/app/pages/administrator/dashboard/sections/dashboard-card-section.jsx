import { Link } from "@inertiajs/react";
import React from "react";

export default function DashboardCardSection({ icon, title, href, link }) {
    return (
        <div class="flex flex-1">
            <div class="group relative overflow-hidden bg-white px-6 pt-10 pb-8 shadow-2xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-lg sm:px-10 w-full">
                <span class="absolute top-10  h-20 w-20 rounded-full bg-red-500 transition-all duration-300 group-hover:scale-[10]"></span>
                <div class="relative  mx-auto w-full flex flex-col justify-between">
                   <div className="flex items-center justify-between">
                   <span class="grid h-20 w-20 place-items-center rounded-full bg-red-500 transition-all duration-300 group-hover:bg-red-400">
                        {icon}
                    </span>
                    <div className="flex items-center text-4xl  group-hover:text-white">
                        100
                    </div>
                   </div>
                    <div class="space-y-6 pt-5 text-base leading-7 text-gray-400 transition-all duration-300 group-hover:text-white">
                        <p>{title}</p>
                    </div>
                    <div class="pt-5 text-base font-semibold leading-7">
                        <p>
                            <Link
                                href={link}
                                class="text-red-500 transition-all duration-300 group-hover:text-white"
                            >
                                {href}
                                &rarr;
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
