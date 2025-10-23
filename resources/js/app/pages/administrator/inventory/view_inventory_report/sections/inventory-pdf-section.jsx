import { Download } from 'lucide-react'
import React from 'react'

export default function InventoryPDFSection() {
    return (
        <>
            <button
                // onClick={() => exportToPDF(mostBorrowed, 'Most Borrowed Items')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
            >
                <Download className="w-4 h-4" /> PDF
            </button>
        </>
    )
}
