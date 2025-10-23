import { Download, TrendingDown } from 'lucide-react'
import React, { useState } from 'react'
import InventoryPDFSection from './inventory-pdf-section';
import InventoryExcelSection from './inventory-excel-section';

export default function InventoryTableSection() {

    const [inventory, setInventory] = useState([
        { id: 1, name: 'Folding Chairs', category: 'Furniture', stock: 5, minStock: 10, borrowed: 15, damaged: 2, location: 'Storage Room A' },
        { id: 2, name: 'Sound System', category: 'Equipment', stock: 2, minStock: 1, borrowed: 1, damaged: 0, location: 'Office' },
        { id: 3, name: 'Tables', category: 'Furniture', stock: 3, minStock: 5, borrowed: 12, damaged: 1, location: 'Storage Room B' },
        { id: 4, name: 'Microphones', category: 'Equipment', stock: 1, minStock: 2, borrowed: 4, damaged: 1, location: 'Office' },
        { id: 5, name: 'Generators', category: 'Equipment', stock: 2, minStock: 1, borrowed: 0, damaged: 0, location: 'Garage' },
        { id: 6, name: 'Tents', category: 'Event Supplies', stock: 0, minStock: 3, borrowed: 8, damaged: 2, location: 'Storage Room C' }
    ]);

    const [borrowHistory, setBorrowHistory] = useState([
        { id: 1, itemId: 1, itemName: 'Folding Chairs', borrower: 'Juan Dela Cruz', contact: '09123456789', borrowDate: '2024-07-15', returnDate: '2024-07-20', status: 'returned', quantity: 10 },
        { id: 2, itemId: 2, itemName: 'Sound System', borrower: 'Maria Santos', contact: '09234567890', borrowDate: '2024-07-18', returnDate: '2024-07-25', status: 'overdue', quantity: 1 },
        { id: 3, itemId: 1, itemName: 'Folding Chairs', borrower: 'Pedro Reyes', contact: '09345678901', borrowDate: '2024-07-20', returnDate: '2024-07-27', status: 'returned', quantity: 5 },
        { id: 4, itemId: 3, itemName: 'Tables', borrower: 'Ana Garcia', contact: '09456789012', borrowDate: '2024-07-22', returnDate: '2024-07-29', status: 'borrowed', quantity: 8 },
        { id: 5, itemId: 4, itemName: 'Microphones', borrower: 'Carlos Lopez', contact: '09567890123', borrowDate: '2024-07-10', returnDate: '2024-07-17', status: 'overdue', quantity: 2 },
        { id: 6, itemId: 6, itemName: 'Tents', borrower: 'Rosa Mendoza', contact: '09678901234', borrowDate: '2024-07-25', returnDate: '2024-08-01', status: 'borrowed', quantity: 3 }
    ]);

    const getMostBorrowedItems = () => {
        return inventory
            .map(item => ({
                ...item,
                totalBorrowed: borrowHistory
                    .filter(borrow => borrow.itemId === item.id)
                    .reduce((sum, borrow) => sum + borrow.quantity, 0)
            }))
            .sort((a, b) => b.totalBorrowed - a.totalBorrowed)
            .slice(0, 10);
    };


    const mostBorrowed = getMostBorrowedItems();

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingDown className="w-5 h-5" />
                        Most Borrowed Items
                    </h3>
                    <div className="flex gap-2">
                        <InventoryPDFSection />
                        <InventoryExcelSection />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Times Borrowed</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Current Stock</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Currently Borrowed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mostBorrowed.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">{item.totalBorrowed}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.stock}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.borrowed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
