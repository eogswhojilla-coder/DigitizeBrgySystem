import { Download } from 'lucide-react';
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const getReportConfig = (reportType) => {
    switch (reportType) {
        case 'most-borrowed':
            return {
                title: 'Most Borrowed Items Report',
                columns: ['Item Name', 'Category', 'Total Borrowed', 'Currently Borrowed', 'Available'],
                mapRow: (item) => ({
                    'Item Name': item.name || item.item_name || 'N/A',
                    'Category': item.category || 'N/A',
                    'Total Borrowed': item.total_borrowed || 0,
                    'Currently Borrowed': item.currently_borrowed || 0,
                    'Available': item.available_quantity || item.quantity || 0,
                }),
            };
        case 'low-stock':
            return {
                title: 'Low Stock Items Report',
                columns: ['Item Name', 'Category', 'Current Stock', 'Minimum Required', 'Shortage', 'Alert Level'],
                mapRow: (item) => ({
                    'Item Name': item.name || item.item_name || 'N/A',
                    'Category': item.category || 'N/A',
                    'Current Stock': item.current_quantity || item.quantity || 0,
                    'Minimum Required': item.minimum_quantity || 0,
                    'Shortage': item.shortage || 0,
                    'Alert Level': item.alert_level || 'warning',
                }),
            };
        case 'overdue':
            return {
                title: 'Overdue Returns Report',
                columns: ['Item Name', 'Borrower', 'Contact', 'Expected Return', 'Days Overdue', 'Urgency'],
                mapRow: (item) => ({
                    'Item Name': item.item_name || item.name || 'N/A',
                    'Borrower': item.borrower_name || 'N/A',
                    'Contact': item.borrower_contact || item.contact_number || 'N/A',
                    'Expected Return': item.expected_return_date || 'N/A',
                    'Days Overdue': item.days_overdue || 0,
                    'Urgency': item.urgency || 'low',
                }),
            };
        case 'damaged':
            return {
                title: 'Damaged Items Report',
                columns: ['Item Name', 'Category', 'Damaged Count', 'Total Stock', 'Damage %'],
                mapRow: (item) => ({
                    'Item Name': item.name || item.item_name || 'N/A',
                    'Category': item.category || 'N/A',
                    'Damaged Count': item.damaged_count || 0,
                    'Total Stock': item.total_quantity || 0,
                    'Damage %': `${item.damage_percentage || 0}%`,
                }),
            };
        case 'borrow-history':
            return {
                title: 'Borrow History Report',
                columns: ['Item Name', 'Borrower', 'Borrowed Date', 'Returned Date', 'Duration (days)', 'Condition', 'Status'],
                mapRow: (item) => ({
                    'Item Name': item.item_name || item.name || 'N/A',
                    'Borrower': item.borrower_name || 'N/A',
                    'Borrowed Date': item.borrow_date || item.borrowed_at || 'N/A',
                    'Returned Date': item.actual_return_date || item.returned_at || 'Not yet returned',
                    'Duration (days)': item.duration_days || 0,
                    'Condition': item.condition_after_return || 'N/A',
                    'Status': item.was_late ? `Late (${item.days_late || 0}d)` : 'On Time',
                }),
            };
        default:
            return { title: 'Inventory Report', columns: [], mapRow: () => ({}) };
    }
};

export default function InventoryExcelSection({ data = [], reportType = 'most-borrowed' }) {
    const exportToExcel = () => {
        const config = getReportConfig(reportType);

        // Header rows
        const headerRows = [
            ['Barangay Inventory Management'],
            [config.title],
            [`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`],
            [`Total Records: ${data.length}`],
            [], // blank row
        ];

        // Data rows
        const rows = data.map(config.mapRow);

        // Create worksheet from data
        const ws = XLSX.utils.json_to_sheet(rows, { header: config.columns });

        // Prepend header rows
        XLSX.utils.sheet_add_aoa(ws, headerRows, { origin: 'A1' });

        // Shift data down by header rows count
        const dataStartRow = headerRows.length;
        const wsData = XLSX.utils.json_to_sheet(rows);

        // Build worksheet with headers + data combined
        const combined = XLSX.utils.aoa_to_sheet(headerRows);
        XLSX.utils.sheet_add_json(combined, rows, { origin: `A${dataStartRow + 1}`, skipHeader: false });

        // Set column widths
        combined['!cols'] = config.columns.map((col) => ({
            wch: Math.max(col.length + 2, 15),
        }));

        // Merge header cells across all columns
        const colCount = config.columns.length;
        combined['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
            { s: { r: 3, c: 0 }, e: { r: 3, c: colCount - 1 } },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, combined, config.title.slice(0, 31));

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const fileName = `${reportType}-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
        saveAs(blob, fileName);
    };

    return (
        <button
            onClick={exportToExcel}
            disabled={data.length === 0}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <Download className="w-4 h-4" /> Excel
        </button>
    );
}
