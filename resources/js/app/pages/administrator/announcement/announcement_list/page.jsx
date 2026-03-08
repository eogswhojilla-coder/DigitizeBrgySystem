import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import Layout from '../../layout'
import { get_announcement_thunk } from '@/app/redux/announcement-thunk';
import AnnouncementTableSection from './_sections/announcement-table-section';
import SearchAnnouncementSection from './_sections/search-announcement-section';
import ButtonAnnouncementSection from './_sections/button-announcement-section';
import PaginationAnnouncementSection from './_sections/pagination-announcement-section';

export default function ListAnnouncement() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(get_announcement_thunk());
    }, [dispatch]);

    return (
        <Layout>
            <div className="p-3 sm:p-4 md:p-6">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Announcements</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage all barangay announcements</p>
                        </div>
                        <ButtonAnnouncementSection />
                    </div>
                    <SearchAnnouncementSection />
                </div>
                <AnnouncementTableSection />
              

            </div>
            <div className='gap-3'> <PaginationAnnouncementSection /></div>

        </Layout>
    )
}
