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
        .qr-code {
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 100px;
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="watermark">BRGY CERTIFICATE</div>
    
    <div class="header">
        <img src="{{ public_path('images/logo.png') }}" alt="Barangay Logo" class="logo">
        <div>
            Republic of the Philippines<br>
            Province of {{ config('app.province') }}<br>
            Municipality of {{ config('app.municipality') }}<br>
            <strong>BARANGAY {{ config('app.barangay') }}</strong>
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

        This is to certify that <strong>{{ $resident->full_name }}</strong>, {{ $resident->age }} years old,
        {{ $resident->civil_status }}, is a bonafide resident of {{ $resident->address }}, Barangay {{ config('app.barangay') }},
        {{ config('app.municipality') }}, {{ config('app.province') }}.<br><br>

        This certification is being issued upon the request of the above-named person for the purpose of
        <strong>{{ $purpose }}</strong>.<br><br>

        @if(isset($metadata['additional_content']))
            {!! $metadata['additional_content'] !!}<br><br>
        @endif

        Issued this {{ $certificate->issued_at->format('jS') }} day of {{ $certificate->issued_at->format('F, Y') }}
        at the Office of the Barangay {{ config('app.barangay') }}, {{ config('app.municipality') }},
        {{ config('app.province') }}.
    </div>

    <div class="footer">
        <div class="signature">
            <div class="signature-line"></div>
            {{ $issuedBy->full_name }}<br>
            {{ $issuedBy->position }}
        </div>
    </div>

    <img src="data:image/png;base64,{{ DNS2D::getBarcodePNG($certificate->certificate_number, 'QRCODE') }}"
         alt="QR Code"
         class="qr-code">
</body>
</html>