import React, { useEffect } from "react";
import Layout from "../../layout";
import { useDispatch, useSelector } from "react-redux";
import { get_families_thunk, delete_family_thunk } from "@/app/redux/family-thunk";
import FamilyTableSection from "./sections/family-table-section";

export default function Page() {
    const dispatch = useDispatch();
    const { families, loading } = useSelector((store) => store.families);

    useEffect(() => {
        dispatch(get_families_thunk());
    }, [dispatch]);

    const handleDelete = async (familyId) => {
        if (confirm('Are you sure you want to delete this family?')) {
            await dispatch(delete_family_thunk(familyId));
        }
    };

    return (
        <Layout>
            <FamilyTableSection 
                families={families?.data || []} 
                loading={loading}
                onDelete={handleDelete}
            />
        </Layout>
    );
}