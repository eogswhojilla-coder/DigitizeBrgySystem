<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Archived Residents Report</title>
    <style>
        @page {
            margin: 20px;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 20px;
            color: #333;
        }
        
        .header h2 {
            margin: 5px 0;
            font-size: 16px;
            color: #666;
        }
        
        .header p {
            margin: 3px 0;
            color: #888;
            font-size: 10px;
        }
        
        .report-info {
            background-color: #fff3cd;
            padding: 12px;
            margin-bottom: 15px;
            border-left: 4px solid #ffc107;
            border-radius: 3px;
        }
        
        .report-info h3 {
            margin: 0 0 8px 0;
            font-size: 13px;
            color: #856404;
            font-weight: bold;
        }
        
        .report-info p {
            margin: 3px 0;
            font-size: 10px;
            color: #856404;
        }
        
        .report-info strong {
            color: #664d03;
        }
        
        .summary {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #e8f4f8;
            border-left: 4px solid #dc3545;
        }
        
        .summary p {
            margin: 0;
            font-size: 12px;
            font-weight: bold;
            color: #721c24;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        table thead {
            background-color: #dc3545;
            color: white;
        }
        
        table th {
            padding: 8px 5px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            border: 1px solid #b02a37;
        }
        
        table tbody tr {
            border-bottom: 1px solid #ddd;
        }
        
        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        table tbody tr:hover {
            background-color: #f5f5f5;
        }
        
        table td {
            padding: 6px 5px;
            font-size: 9px;
            border: 1px solid #ddd;
        }
        
        .reason-badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        
        .reason-moved { background-color: #cfe2ff; color: #084298; }
        .reason-passed { background-color: #e2e3e5; color: #41464b; }
        .reason-duplicate { background-color: #fff3cd; color: #664d03; }
        .reason-jurisdiction { background-color: #ffe5d0; color: #97400e; }
        .reason-inactive { background-color: #e2d9f3; color: #432874; }
        
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 9px;
            color: #666;
        }
        
        .empty-message {
            text-align: center;
            padding: 30px;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>BARANGAY ARCHIVED RESIDENTS</h1>
        <h2>{{ $reportType }}</h2>
        <p>Generated: {{ $generatedDate }} at {{ $generatedTime }}</p>
    </div>

    <div class="report-info">
        <h3>📋 Report Details</h3>
        <p><strong>Report Type:</strong> {{ $reportType }}</p>
        <p><strong>Archive Reason Filter:</strong> {{ $archiveReason }}</p>
        <p><strong>Total Records:</strong> {{ $totalCount }}</p>
    </div>

    <div class="summary">
        <p>Total Archived Residents: {{ $totalCount }}</p>
    </div>

    @if($archived->count() > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 8%;">#</th>
                    <th style="width: 12%;">RESIDENT NO.</th>
                    <th style="width: 18%;">NAME</th>
                    <th style="width: 15%;">REASON</th>
                    <th style="width: 10%;">DATE</th>
                    <th style="width: 8%;">OFFICIAL</th>
                    <th style="width: 12%;">POSITION</th>
                    <th style="width: 17%;">NOTES</th>
                </tr>
            </thead>
            <tbody>
                @foreach($archived as $index => $resident)
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td style="font-family: 'Courier New', monospace;">{{ $resident['resident_number'] }}</td>
                    <td style="font-weight: bold;">{{ $resident['name'] }}</td>
                    <td>
                        @php
                            $reasonClass = 'reason-moved';
                            if(str_contains($resident['archive_reason'], 'Passed')) $reasonClass = 'reason-passed';
                            elseif(str_contains($resident['archive_reason'], 'Duplicate')) $reasonClass = 'reason-duplicate';
                            elseif(str_contains($resident['archive_reason'], 'jurisdiction')) $reasonClass = 'reason-jurisdiction';
                            elseif(str_contains($resident['archive_reason'], 'Inactive')) $reasonClass = 'reason-inactive';
                        @endphp
                        <span class="reason-badge {{ $reasonClass }}">{{ $resident['archive_reason'] }}</span>
                    </td>
                    <td>{{ $resident['archive_date'] }}</td>
                    <td style="text-align: center;">
                        @if($resident['was_official'] === 'YES')
                            <strong style="color: #28a745;">✓ YES</strong>
                        @else
                            NO
                        @endif
                    </td>
                    <td>{{ $resident['position_held'] }}</td>
                    <td style="font-size: 8px; color: #666;">{{ Str::limit($resident['notes'], 40) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="empty-message">
            No archived residents found matching the selected criteria.
        </div>
    @endif

    <div class="footer">
        <p>This is a computer-generated document. No signature required.</p>
        <p>Barangay Management System | {{ $generatedDate }}</p>
    </div>
</body>
</html>
