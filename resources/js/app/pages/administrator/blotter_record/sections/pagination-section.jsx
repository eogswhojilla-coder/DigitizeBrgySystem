import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { blotters } = useSelector((store) => store.blotters);
    console.log("blotters", blotters);
    return (
        <>
            <Pagination data={blotters} />
        </>
    );
}
