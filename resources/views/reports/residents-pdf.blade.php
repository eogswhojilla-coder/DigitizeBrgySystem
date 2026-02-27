<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Residents Report</title>
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
        
        .filters {
            background-color: #f5f5f5;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 5px;
        }
        
        .filters h3 {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #333;
        }
        
        .filters p {
            margin: 3px 0;
            font-size: 10px;
        }
        
        .filters strong {
            color: #333;
        }
        
        .summary {
            margin-bottom: 15px;
            padding: 8px;
            background-color: #e8f4f8;
            border-left: 4px solid #2563eb;
        }
        
        .summary p {
            margin: 0;
            font-size: 12px;
            font-weight: bold;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        table thead {
            background-color: #2563eb;
            color: white;
        }
        
        table th {
            padding: 8px 5px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
        }
        
        table tbody tr {
            border-bottom: 1px solid #ddd;
        }
        
        table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        table tbody tr:hover {
            background-color: #f0f0f0;
        }
        
        table td {
            padding: 6px 5px;
            font-size: 9px;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #999;
            font-style: italic;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 9px;
            color: #888;
        }
        
        .status-active {
            color: #10b981;
            font-weight: bold;
        }
        
        .status-inactive {
            color: #ef4444;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>BARANGAY RESIDENTS REPORT</h1>
        <h2>Barangay Information System</h2>
        <p>Generated on: {{ $generatedDate }}</p>
    </div>

    @if(array_filter($filters))
    <div class="filters">
        <h3>Applied Filters:</h3>
        @if($filters['voters'])
            <p><strong>Voters:</strong> {{ $filters['voters'] }}</p>
        @endif
        @if($filters['age'])
            <p><strong>Age:</strong> {{ $filters['age'] }} years old</p>
        @endif
        @if($filters['status'])
            <p><strong>Status:</strong> {{ $filters['status'] }}</p>
        @endif
        @if($filters['pwd'])
            <p><strong>PWD:</strong> {{ $filters['pwd'] }}</p>
        @endif
        @if($filters['singleParent'])
            <p><strong>Single Parent:</strong> {{ $filters['singleParent'] }}</p>
        @endif
        @if($filters['senior'])
            <p><strong>Senior Citizen:</strong> {{ $filters['senior'] }}</p>
        @endif
    </div>
    @endif

    <div class="summary">
        <p>Total Residents: {{ $totalCount }}</p>
    </div>

    @if($residents->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 25%;">Name</th>
                <th style="width: 8%;">Age</th>
                <th style="width: 8%;">Gender</th>
                <th style="width: 8%;">PWD</th>
                <th style="width: 10%;">Single Parent</th>
                <th style="width: 8%;">Voters</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 8%;">Senior</th>
                <th style="width: 10%;">Address</th>
            </tr>
        </thead>
        <tbody>
            @foreach($residents as $index => $resident)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $resident['name'] }}</td>
                <td>{{ $resident['age'] }}</td>
                <td>{{ $resident['gender'] ?? '-' }}</td>
                <td>{{ $resident['pwd'] }}</td>
                <td>{{ $resident['singleParent'] }}</td>
                <td>{{ $resident['voters'] }}</td>
                <td class="{{ $resident['status'] === 'ACTIVE' ? 'status-active' : 'status-inactive' }}">
                    {{ $resident['status'] }}
                </td>
                <td>{{ $resident['senior'] }}</td>
                <td>{{ $resident['address'] ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div class="no-data">
        <p>No residents found matching the selected criteria.</p>
    </div>
    @endif

    <div class="footer">
        <p>This is a computer-generated report from the Barangay Information System</p>
        <p>Printed on {{ $generatedDate }}</p>
    </div>
</body>
</html>
