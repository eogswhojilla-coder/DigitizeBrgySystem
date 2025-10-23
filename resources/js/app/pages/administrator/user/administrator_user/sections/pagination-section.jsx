import Pagination from "@/app/_components/pagination";
import { useSelector } from "react-redux";

export default function PaginationSection() {
    const { administrators } = useSelector((store) => store.administrators);
    console.log("administrators", administrators);
    return (
        <>
            <Pagination data={administrators} />
        </>
    );
}
