
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $type->name }} - {{ $certificate->certificate_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            width: 100px;
            height: auto;
            margin-bottom: 15px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .content {
            margin-bottom: 40px;
            text-align: justify;
        }
        .footer {
            margin-top: 60px;
        }
        .signature {
            float: right;
            width: 200px;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid black;
            margin-top: 40px;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72px;
            opacity: 0.1;
            color: #000;
            z-index: -1;
        }
        .certificate-details {
            margin-bottom: 20px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="watermark">BRGY CERTIFICATE</div>
    
    <div class="header">
        @if(file_exists(public_path('images/logo.png')))
            <img src="{{ public_path('images/logo.png') }}" alt="Barangay Logo" class="logo">
        @endif
        <div>
            Republic of the Philippines<br>
            Province of {{ config('app.province', 'Sample Province') }}<br>
            Municipality of {{ config('app.municipality', 'Sample Municipality') }}<br>
            <strong>BARANGAY {{ strtoupper(config('app.barangay', 'Sample Barangay')) }}</strong>
        </div>
    </div>

    <div class="title">
        {{ $type->name }}
    </div>

    <div class="certificate-details">
        Certificate No: {{ $certificate->certificate_number }}<br>
        Date Issued: {{ $certificate->issued_at->format('F d, Y') }}<br>
        Valid Until: {{ $certificate->valid_until->format('F d, Y') }}
    </div>

    <div class="content">
        TO WHOM IT MAY CONCERN:<br><br>

        This is to certify that <strong>{{ $resident->full_name }}</strong>,
        @if($resident->age != 'N/A') {{ $resident->age }} years old, @endif
        @if($resident->civil_status != 'N/A') {{ $resident->civil_status }}, @endif
        is a bonafide resident of {{ $resident->address }}, Barangay {{ config('app.barangay', 'Sample Barangay') }},
        {{ config('app.municipality', 'Sample Municipality') }}, {{ config('app.province', 'Sample Province') }}.<br><br>

        This certification is being issued upon the request of the above-named person for the purpose of
        <strong>{{ $purpose }}</strong>.<br><br>

        @if(isset($metadata['additional_content']))
            {!! $metadata['additional_content'] !!}<br><br>
        @endif

        Issued this {{ $certificate->issued_at->format('jS') }} day of {{ $certificate->issued_at->format('F, Y') }}
        at the Office of the Barangay {{ config('app.barangay', 'Sample Barangay') }}, {{ config('app.municipality', 'Sample Municipality') }},
        {{ config('app.province', 'Sample Province') }}.
    </div>

    <div class="footer">
        <div class="signature">
            <div class="signature-line"></div>
            {{ $issuedBy->full_name }}<br>
            <small>{{ $issuedBy->position }}</small>
        </div>
    </div>

    <div style="margin-top: 100px; text-align: center; font-size: 10px;">
        Certificate Number: {{ $certificate->certificate_number }}
    </div>
</body>
</html>