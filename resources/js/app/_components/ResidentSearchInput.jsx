import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';

export default function ResidentSearchInput({ onSelect, placeholder = "Search resident..." }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredResidents, setFilteredResidents] = useState([]);
    const { residents } = useSelector((store) => store.barangay_residents);
    const wrapperRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter residents based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredResidents([]);
            return;
        }

        const filtered = residents?.data?.filter((resident) => {
            const fullName = `${resident.firstName} ${resident.middleName} ${resident.lastName}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        }) || [];

        setFilteredResidents(filtered);
    }, [searchTerm, residents]);

    const handleSelect = (resident) => {
        const fullName = `${resident.firstName} ${resident.middleName} ${resident.lastName}`;
        setSearchTerm(fullName);
        onSelect(resident);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                    placeholder={placeholder}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {isOpen && filteredResidents.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    {filteredResidents.map((resident) => (
                        <div
                            key={resident.id}
                            onClick={() => handleSelect(resident)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="font-medium">
                                {resident.firstName} {resident.middleName} {resident.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                                Age: {resident.age} • Status: {resident.status}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}