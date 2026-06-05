import Button from '@/app/_components/button';
import { Filter, RotateCcw } from 'lucide-react';
import React from 'react'

export default function SearchReportSection({ filters, onFilterChange, onFilter, onReset }) {
    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">

                    {/* VOTERS */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            VOTERS
                        </label>
                        <select
                            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.voters}
                            onChange={(e) => onFilterChange('voters', e.target.value)}
                        >
                            <option value="">SELECT STATUS</option>
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
                            type="number"
                            placeholder="Enter age"
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.age}
                            onChange={(e) => onFilterChange('age', e.target.value)}
                        />
                    </div>

                    {/* PWD */}
                    <div className="flex items-center gap-3">
                        <label className="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-fit">
                            PWD
                        </label>
                        <select
                            className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.pwd}
                            onChange={(e) => onFilterChange('pwd', e.target.value)}
                        >
                            <option value="">SELECT STATUS</option>
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
                            onChange={(e) => onFilterChange('singleParent', e.target.value)}
                        >
                            <option value="">SELECT STATUS</option>
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
                            onChange={(e) => onFilterChange('senior', e.target.value)}
                        >
                            <option value="">SELECT STATUS</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-end">
                    <Button
                        onClick={onFilter}
                        variant="primary"
                        className=" px-6 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        <Filter size={16} />
                        FILTER
                    </Button>
                    <Button
                        onClick={onReset}
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
