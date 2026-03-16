import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/react";
import { search } from "../lib/search-lib";

export default function Pagination({ data }) {
    const currentPage = data?.current_page;
    const lastPage = data?.last_page;
    const maxVisiblePages = 5; // Maximum number of pages to show
    const onPageChange = data?.onPageChange;

    const getPageNumbers = () => {
        const pages = [];

        if (lastPage <= maxVisiblePages) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", lastPage);
            } else if (currentPage > lastPage - 3) {
                pages.push(
                    1,
                    "...",
                    lastPage - 3,
                    lastPage - 2,
                    lastPage - 1,
                    lastPage
                );
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    lastPage
                );
            }
        }

        return pages;   
    };

    return (
        <nav className="flex items-center justify-between   px-4 sm:px-0 w-full">
            <div className="-mt-px flex w-0 flex-1">
                {currentPage > 1 && (
                    <button
                        onClick={() => onPageChange && onPageChange(currentPage - 1)}
                        className="inline-flex items-center  border-transparent bg-blue-500 p-2 text-white rounded-md text-sm font-medium"
                    >
                        <ArrowLongLeftIcon
                            aria-hidden="true"
                            className="mr-3 h-5 w-5 text-white"
                        />
                        Previous
                    </button>
                )}
            </div>
            <div className="hidden md:-mt-px md:flex  gap-3">
                {getPageNumbers().map((page, index) => (
                    typeof page === "number" ? (
                        <button
                            key={index}
                            onClick={() => onPageChange && onPageChange(page)}
                            className={`inline-flex items-center  rounded-md text-center px-4 p-2 text-sm font-medium ${
                                currentPage === page
                                    ? "text-blue-600 border-blue-600 border-2 text-blue"
                                    : "bg-blue-500  hover:bg-blue-500  text-white "
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="inline-flex items-center px-4 p-2 text-sm font-medium text-gray-400">{page}</span>
                    )
                ))}
            </div>
            <div className="-mt-px flex  flex-1 justify-end w-full">
                {currentPage < lastPage && (
                    <button
                        onClick={() => onPageChange && onPageChange(currentPage + 1)}
                        className="inline-flex items-center  border-transparent bg-blue-500 p-2 text-white rounded-md text-sm font-medium  "
                    >
                        Next
                        <ArrowLongRightIcon
                            aria-hidden="true"
                            className="ml-3 h-5 w-5 text-white"
                        />
                    </button>
                )}
            </div>
        </nav>
    );
}
