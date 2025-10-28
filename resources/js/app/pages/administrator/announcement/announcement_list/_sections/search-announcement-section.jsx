import React from 'react';
import { useDispatch } from 'react-redux';
import { Search } from 'lucide-react';
import { get_announcement_thunk } from '@/app/redux/announcement-thunk';

export default function SearchAnnouncementSection() {
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = e.target.search.value;
        // You can dispatch with search parameter when your API supports it
        dispatch(get_announcement_thunk());
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    name="search"
                    placeholder="Search announcements..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Search
            </button>
        </form>
    );
}