import { Download } from 'lucide-react';
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getReportConfig = (reportType) => {
    switch (reportType) {
        case 'most-borrowed':
            return {
                title: 'Most Borrowed Items Report',
                columns: ['Item Name', 'Category', 'Total Borrowed', 'Currently Borrowed', 'Available'],
                mapRow: (item) => [
                    item.name || item.item_name || 'N/A',
                    item.category || 'N/A',
                    item.total_borrowed || 0,
                    item.currently_borrowed || 0,
                    item.available_quantity || item.quantity || 0,
                ],
            };
        case 'low-stock':
            return {
                title: 'Low Stock Items Report',
                columns: ['Item Name', 'Category', 'Current Stock', 'Minimum Required', 'Shortage', 'Alert Level'],
                mapRow: (item) => [
                    item.name || item.item_name || 'N/A',
                    item.category || 'N/A',
                    item.current_quantity || item.quantity || 0,
                    item.minimum_quantity || 0,
                    item.shortage || 0,
                    item.alert_level || 'warning',
                ],
            };
        case 'overdue':
            return {
                title: 'Overdue Returns Report',
                columns: ['Item Name', 'Borrower', 'Contact', 'Expected Return', 'Days Overdue', 'Urgency'],
                mapRow: (item) => [
                    item.item_name || item.name || 'N/A',
                    item.borrower_name || 'N/A',
                    item.borrower_contact || item.contact_number || 'N/A',
                    item.expected_return_date || 'N/A',
                    `${item.days_overdue || 0} days`,
                    item.urgency || 'low',
                ],
            };
        case 'damaged':
            return {
                title: 'Damaged Items Report',
                columns: ['Item Name', 'Category', 'Damaged Count', 'Total Stock', 'Damage %'],
                mapRow: (item) => [
                    item.name || item.item_name || 'N/A',
                    item.category || 'N/A',
                    item.damaged_count || 0,
                    item.total_quantity || 0,
                    `${item.damage_percentage || 0}%`,
                ],
            };
        case 'borrow-history':
            return {
                title: 'Borrow History Report',
                columns: ['Item Name', 'Borrower', 'Borrowed Date', 'Returned Date', 'Duration', 'Condition', 'Status'],
                mapRow: (item) => [
                    item.item_name || item.name || 'N/A',
                    item.borrower_name || 'N/A',
                    item.borrow_date || item.borrowed_at || 'N/A',
                    item.actual_return_date || item.returned_at || 'Not yet returned',
                    `${item.duration_days || 0} days`,
                    item.condition_after_return || 'N/A',
                    item.was_late ? `Late (${item.days_late || 0}d)` : 'On Time',
                ],
            };
        default:
            return { title: 'Inventory Report', columns: [], mapRow: () => [] };
    }
};

export default function InventoryPDFSection({ data = [], reportType = 'most-borrowed' }) {
    const exportToPDF = () => {
        const config = getReportConfig(reportType);
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Barangay Inventory Management', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(config.title, pageWidth / 2, 28, { align: 'center' });

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth / 2, 34, { align: 'center' });
        doc.text(`Total Records: ${data.length}`, pageWidth / 2, 39, { align: 'center' });

        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(14, 42, pageWidth - 14, 42);

        // Table
        const rows = data.map(config.mapRow);

        autoTable(doc, {
            head: [config.columns],
            body: rows,
            startY: 46,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
            didDrawPage: (hookData) => {
                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `Page ${hookData.pageNumber} of ${pageCount}`,
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            },
        });

        const fileName = `${reportType}-report-${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(fileName);
    };

    return (
        <button
            onClick={exportToPDF}
            disabled={data.length === 0}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <Download className="w-4 h-4" /> PDF
        </button>
    );
}
