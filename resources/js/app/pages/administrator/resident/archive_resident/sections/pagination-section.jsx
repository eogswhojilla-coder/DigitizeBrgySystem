import Pagination from "@/app/_components/pagination";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { residents } = useSelector((store) => store.barangay_residents);
    console.log("residents", residents);

    return (
        <>
            <Pagination data={residents} />
        </>
    );
}
