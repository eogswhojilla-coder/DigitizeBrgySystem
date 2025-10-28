import React, { useEffect } from "react";

import CalendarSection from "./_sections/calendar-section";
import store from "@/app/store/store";
import { get_announcement_calendar_thunk } from "@/app/redux/announcement-thunk";
import Layout from "../../layout";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_announcement_calendar_thunk());
    }, []);
    return (
        <Layout>
            <CalendarSection />
        </Layout>
    );
}
