import { Download } from 'lucide-react'
import React from 'react'

export default function InventoryExcelSection() {
    return (
        <>
            <button
                // onClick={() => exportToExcel(mostBorrowed, 'Most Borrowed Items')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
            >
                <Download className="w-4 h-4" /> Excel
            </button>
        </>
    )
}
