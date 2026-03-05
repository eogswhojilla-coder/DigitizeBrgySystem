<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Official End Term Report</title>
    <style>
        @page {
            margin: 20mm 15mm;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            line-height: 1.4;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 10px;
        }
        
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 20pt;
            color: #1e40af;
            font-weight: bold;
        }
        
        .header .subtitle {
            margin: 0;
            font-size: 11pt;
            color: #666;
        }
        
        .report-info {
            background-color: #fef3c7;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            border-left: 4px solid #f59e0b;
        }
        
        .report-info p {
            margin: 3px 0;
            font-size: 9pt;
        }
        
        .summary {
            margin-bottom: 15px;
            padding: 8px;
            background-color: #f3f4f6;
            border-radius: 4px;
        }
        
        .summary p {
            margin: 3px 0;
            font-weight: bold;
            color: #1f2937;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 9pt;
        }
        
        table thead {
            background-color: #1e40af;
            color: white;
        }
        
        table th {
            padding: 8px 5px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #1e40af;
            font-size: 9pt;
        }
        
        table td {
            padding: 6px 5px;
            border: 1px solid #ddd;
            vertical-align: top;
        }
        
        table tbody tr:nth-child(even) {
            background-color: #f9fafb;
        }
        
        table tbody tr:hover {
            background-color: #f3f4f6;
        }
        
        .position-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 8pt;
            font-weight: bold;
            color: white;
        }
        
        .position-kagawad { background-color: #2563eb; }
        .position-chairman { background-color: #16a34a; }
        .position-secretary { background-color: #9333ea; }
        .position-sk-kagawad { background-color: #ea580c; }
        .position-sk-chairman { background-color: #0d9488; }
        .position-treasurer { background-color: #db2777; }
        .position-default { background-color: #6b7280; }
        
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8pt;
            font-weight: bold;
            background-color: #ef4444;
            color: white;
        }
        
        .yes-badge {
            color: #16a34a;
            font-weight: bold;
        }
        
        .no-badge {
            color: #6b7280;
        }
        
        .empty-state {
            text-align: center;
            padding: 30px;
            color: #9ca3af;
            font-style: italic;
        }
        
        .footer {
            position: fixed;
            bottom: 10mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #6b7280;
            border-top: 1px solid #ddd;
            padding-top: 5px;
        }
        
        .page-number:after {
            content: counter(page);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>OFFICIAL END TERM REPORT</h1>
        <p class="subtitle">Officials Whose Terms Have Ended</p>
        <p class="subtitle">Generated: {{ $generated_at }}</p>
    </div>
    
    @if($has_filters)
    <div class="report-info">
        <p><strong>📋 Report Filters:</strong> {{ $filter_info }}</p>
    </div>
    @endif
    
    <div class="summary">
        <p>Total Officials with Ended Terms: {{ $total_count }}</p>
    </div>
    
    @if($officials->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 10%;">Official No.</th>
                <th style="width: 20%;">Name</th>
                <th style="width: 12%;">Position</th>
                <th style="width: 5%;">PWD</th>
                <th style="width: 8%;">Single Parent</th>
                <th style="width: 6%;">Voter</th>
                <th style="width: 12%;">Term From</th>
                <th style="width: 12%;">Term To</th>
                <th style="width: 10%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($officials as $index => $official)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $official['officialNumber'] }}</td>
                <td><strong>{{ $official['name'] }}</strong></td>
                <td>
                    @php
                        $positionClass = match($official['position']) {
                            'KAGAWAD' => 'position-kagawad',
                            'CHAIRMAN' => 'position-chairman',
                            'SECRETARY' => 'position-secretary',
                            'SK KAGAWAD' => 'position-sk-kagawad',
                            'SK CHAIRMAN' => 'position-sk-chairman',
                            'TREASURER' => 'position-treasurer',
                            default => 'position-default'
                        };
                    @endphp
                    <span class="position-badge {{ $positionClass }}">
                        {{ $official['position'] }}
                    </span>
                </td>
                <td class="{{ $official['pwd'] === 'YES' ? 'yes-badge' : 'no-badge' }}">
                    {{ $official['pwd'] }}
                </td>
                <td class="{{ $official['single_parent'] === 'YES' ? 'yes-badge' : 'no-badge' }}">
                    {{ $official['single_parent'] }}
                </td>
                <td class="{{ $official['voters'] === 'YES' ? 'yes-badge' : 'no-badge' }}">
                    {{ $official['voters'] }}
                </td>
                <td>{{ $official['term_from'] }}</td>
                <td>{{ $official['term_to'] }}</td>
                <td>
                    <span class="status-badge">NOT ACTIVE</span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div class="empty-state">
        <p>No officials with ended terms found matching the selected criteria.</p>
    </div>
    @endif
    
    <div class="footer">
        <p>This report was automatically generated by the Barangay Digitization System on {{ $generated_at }}</p>
    </div>
</body>
</html>
