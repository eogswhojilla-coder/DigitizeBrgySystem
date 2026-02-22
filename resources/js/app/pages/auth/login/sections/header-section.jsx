import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

const navigation = [
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Announcements", id: "announcements" },
    { name: "Contact", id: "contact" },
];

export default function HeaderSection() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
            <nav
                aria-label="Global"
                className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
            >
                <div className="flex lg:flex-1 items-center gap-3">
                    <a href="/" className="flex items-center">
                        <span className="sr-only">Barangay Logo</span>
                        <img
                            src="/images/brgy-ll-logo.png"
                            alt="Barangay Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </a>

                    <p className="text-md font-bold text-gray-800 tracking-tight dark:text-white">
                        BARANGAY PORTAL
                    </p>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollTo(item.id)}
                            className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
                <div className="flex flex-1 items-center justify-end gap-x-6">
                    <Link
                        href="/auth/login"
                        className="hidden text-sm/6 font-semibold text-gray-900 lg:block dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/auth/register"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                    >
                        Sign up
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
            </nav>
        </header>
    );
}
