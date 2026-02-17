import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, X, User } from 'lucide-react';

export default function AutocompleteResident({ 
    label, 
    placeholder = "Search for a resident...", 
    onSelect, 
    error,
    required = false,
    value,
    register,
    name
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [residents, setResidents] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search residents when search term changes
    useEffect(() => {
        if (searchTerm.length >= 2) {
            searchResidents();
        } else {
            setResidents([]);
            setShowDropdown(false);
        }
    }, [searchTerm]);

    const searchResidents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/residents/search?search=${searchTerm}`);
            setResidents(response.data || []);
            setShowDropdown(true);
        } catch (error) {
            console.error('Error searching residents:', error);
            setResidents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectResident = (resident) => {
        const fullName = `${resident.firstName} ${resident.middleName || ''} ${resident.lastName}`.trim();
        setSelectedResident(resident);
        setSearchTerm(fullName);
        setShowDropdown(false);
        
        if (onSelect) {
            onSelect(resident);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setSelectedResident(null);
        setResidents([]);
        if (onSelect) {
            onSelect(null);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        if (residents.length > 0) {
                            setShowDropdown(true);
                        }
                    }}
                    className={`w-full pl-10 pr-10 py-3 border ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder={placeholder}
                />
                
                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Hidden input for form submission */}
            {selectedResident && register && (
                <>
                    <input
                        type="hidden"
                        {...register(name || 'respondent_id')}
                        value={selectedResident.id}
                    />
                    <input
                        type="hidden"
                        {...register('respondent')}
                        value={searchTerm}
                    />
                </>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-3 text-center text-gray-500">
                            Searching...
                        </div>
                    ) : residents.length > 0 ? (
                        <ul>
                            {residents.map((resident) => (
                                <li
                                    key={resident.id}
                                    onClick={() => handleSelectResident(resident)}
                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {resident.firstName} {resident.middleName} {resident.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Resident ID: {resident.residentId}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-center text-gray-500">
                            No residents found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
