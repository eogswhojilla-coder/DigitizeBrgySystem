import Pagination from "@/app/_components/pagination";
import React from "react";
import { useSelector } from "react-redux";

export default function PaginationAnnouncementSection() {
    const { announcements } = useSelector((store) => store.announcements);
    console.log("announcements", announcements);

    return (
        <>
            <Pagination data={announcements} />
        </>
    );
}