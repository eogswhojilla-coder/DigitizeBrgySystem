import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { inventories } = useSelector((store) => store.inventories);
    console.log("inventories", inventories);
    return (
        <>
            <Pagination data={inventories} />
        </>
    );
}
