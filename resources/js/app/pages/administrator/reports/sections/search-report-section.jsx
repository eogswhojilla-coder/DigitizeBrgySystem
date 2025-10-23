import Button from '@/app/_components/button';
import { Filter, RotateCcw } from 'lucide-react';
import React, { useState } from 'react'

export default function SearchReportSection() {
    const [filters, setFilters] = useState({
        voters: '',
        age: '',
        status: '',
        pwd: '',
        singleParent: '',
        senior: ''
    });

    const [residents] = useState([
        { name: 'Hojilla Wacky D.', age: '20', pwd: '', singleParent: 'NO', voters: 'YES', status: 'ACTIVE', senior: 'NO' },
        { name: 'Asdasd Asdasd A.', age: '', pwd: '', singleParent: 'NO', voters: 'YES', status: 'ACTIVE', senior: 'NO' },
        { name: 'Bacarro Jancen P.', age: '20', pwd: '', singleParent: 'NO', voters: 'YES', status: 'ACTIVE', senior: 'NO' },
        { name: 'Hojilla Wacky D.', age: '20', pwd: '', singleParent: 'NO', voters: 'YES', status: 'ACTIVE', senior: 'NO' },
        { name: 'Jan Aj S.', age: '', pwd: '', singleParent: 'NO', voters: 'YES', status: 'ACTIVE', senior: 'NO' },
        { name: 'Pa Pa P.', age: '', pwd: '', singleParent: 'NO', voters: 'YES', status: 'ACTIVE', senior: 'NO' },
        { name: 'Dela Ayesha M.', age: '', pwd: '', singleParent: 'NO', voters: 'NO', status: 'ACTIVE', senior: 'NO' },
        { name: 'Maquilang Christine F.', age: '22', pwd: '', singleParent: 'NO', voters: 'YES', status: 'ACTIVE', senior: 'NO' }
    ]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleFilter = () => {
        console.log('Filtering with:', filters);
    };

    const handleReset = () => {
        setFilters({
            voters: '',
            age: '',
            status: '',
            pwd: '',
            singleParent: '',
            senior: ''
        });
    };

    const handlePrint = () => {
        window.print();
    };
    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                    {/* VOTERS */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            VOTERS
                        </label>
                        <select
                            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.voters}
                            onChange={(e) => handleFilterChange('voters', e.target.value)}
                        >
                            <option value="">--SELECT VOTERS--</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>

                    {/* AGE */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            AGE
                        </label>
                        <input
                            type="text"
                            placeholder="Enter age"
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.age}
                            onChange={(e) => handleFilterChange('age', e.target.value)}
                        />
                    </div>

                    {/* STATUS */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            STATUS
                        </label>
                        <select
                            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">--SELECT STATUS--</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>

                    {/* PWD */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            PWD
                        </label>
                        <select
                            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.pwd}
                            onChange={(e) => handleFilterChange('pwd', e.target.value)}
                        >
                            <option value="">--SELECT PWD--</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>

                    {/* SINGLE PARENT */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            SINGLE PARENT
                        </label>
                        <select
                            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.singleParent}
                            onChange={(e) => handleFilterChange('singleParent', e.target.value)}
                        >
                            <option value="">--SELECT PARENT STATUS--</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>

                    {/* SENIOR */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            SENIOR
                        </label>
                        <select
                            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.senior}
                            onChange={(e) => handleFilterChange('senior', e.target.value)}
                        >
                            <option value="">--SELECT SENIOR--</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-4 justify-end">
                    <Button
                        onClick={handleFilter}
                        variant="primary"
                        className=" px-6 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        <Filter size={16} />
                        FILTER
                    </Button>
                    <Button
                        onClick={handleReset}
                        variant="danger"
                        className="px-6 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw size={16} />
                        RESET
                    </Button>
                </div>
            </div>
        </>
    )
}
