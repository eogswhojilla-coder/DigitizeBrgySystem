<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Certificate of Indigency</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            padding: 30px 50px;
            line-height: 1.5;
            position: relative;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.08;
            z-index: -1;
            text-align: center;
            width: 100%;
        }

        .watermark img {
            width: 500px;
            height: auto;
        }

        .header-container {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .logo-left {
            display: table-cell;
            width: 100px;
            vertical-align: middle;
            text-align: center;
        }

        .logo-left img {
            width: 90px;
            height: 90px;
        }

        .header-center {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }

        .logo-right {
            display: table-cell;
            width: 100px;
            vertical-align: middle;
            text-align: center;
        }

        .logo-right img {
            width: 90px;
            height: 90px;
        }

        .header-center p {
            margin: 2px 0;
            font-size: 11pt;
        }

        .title {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 25px 0;
        }

        .content {
            text-align: justify;
            margin: 20px 0;
        }

        .content p {
            margin: 12px 0;
        }

        .signatures {
            margin-top: 50px;
            display: table;
            width: 100%;
        }

        .signature-left {
            display: table-cell;
            width: 50%;
            text-align: center;
            padding-right: 20px;
        }

        .signature-right {
            display: table-cell;
            width: 50%;
            text-align: center;
            padding-left: 20px;
        }

        .signature-line {
            border-bottom: 2px solid #000;
            padding-bottom: 2px;
            margin-bottom: 5px;
            min-height: 40px;
        }

        .details-container {
            display: table;
            width: 100%;
            margin-top: 30px;
        }

        .details-left {
            display: table-cell;
            width: 60%;
            vertical-align: top;
        }

        .details-left p {
            margin: 3px 0;
            font-size: 10pt;
        }

        .qr-box {
            display: table-cell;
            width: 40%;
            text-align: right;
            vertical-align: top;
            padding-right: 20px;
        }

        .qr-placeholder {
            width: 100px;
            height: 100px;
            border: 2px solid #000;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 9pt;
        }

        .note {
            font-size: 10pt;
            margin-top: 20px;
        }
    </style>
</head>

<body>

    <!-- Watermark -->
    <div class="watermark">
        <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/brgy-ll-logo.png'))) }}" alt="Barangay Logo">
    </div>

    <!-- Header with Logos -->
    <div class="header-container">
        <div class="logo-left">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/San_Carlos_Negros_Occidental.png'))) }}" alt="San Carlos Logo">
        </div>
        <div class="header-center">
            <p>Republic of the Philippines</p>
            <p>Province of Negros Occidental</p>
            <p>City of San Carlos</p>
            <p>BARANGAY II</p>
            <p style="font-size: 10pt;">OFFICE OF THE PUNONG BARANGAY</p>
        </div>
        <div class="logo-right">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/brgy-ll-logo.png'))) }}" alt="Barangay Logo">
        </div>
    </div>

    <!-- Title -->
    <div class="title">CERTIFICATE OF INDIGENCY</div>

    <!-- Content -->
    <div class="content">
        <p><strong>To Whom it May Concern:</strong></p>

        <p style="text-indent: 40px;">
            This is to certify that <strong><u>{{ strtoupper($residentName ?? 'N/A') }}</u></strong>,
            {{ $residentAge ?? 'N/A' }} years old,
            <strong><u>{{ ucfirst($residentCivilStatus ?? 'Single') }}</u></strong>,
            residing at
            <strong><u>{{ strtoupper($residentAddress ?? 'BARANGAY II, SAN CARLOS CITY, NEGROS OCCIDENTAL') }}</u></strong>,
            is a bonafide resident of this Barangay and belongs to the indigent families in our community.
        </p>

        <p style="text-indent: 40px;">
            This certification is being issued upon the request of the above-named person for
            <strong><u>{{ strtoupper($purpose ?? 'General Purpose') }}</u></strong> purposes and to whatever legal purpose it may serve.
        </p>

        <p style="text-indent: 40px;">
            Issued this <strong><u>{{ $date ?? now()->format('jS \d\a\y \o\f F, Y') }}</u></strong>, Barangay Hall,
            <strong>BARANGAY II</strong>, San Carlos City, Negros Occidental, Philippines.
        </p>
    </div>

    <!-- Signatures -->
    <div class="signatures">
        <div class="signature-left">
            <strong>{{ strtoupper($residentName ?? 'N/A') }}</strong><br>
            <div class="signature-line"></div>
            <span style="font-size: 9pt;">APPLICANT SIGNATURE</span>
        </div>
        <div class="signature-right">
            <strong>{{ strtoupper($punongBarangay ?? 'HON. FRANCIS R. EUSEBIO') }}</strong><br>
            <div class="signature-line"></div>
            <span style="font-size: 9pt;">PUNONG BARANGAY</span>
        </div>
    </div>

    <!-- Details and QR Code -->
    <div class="details-container">
        <div class="details-left">
            <p><strong>Purpose:</strong> {{ strtoupper($purpose ?? 'General Purpose') }}</p>
            <p><strong>Certificate No.:</strong> {{ $barangayId ?? 'CODE' }}</p>
            <p><strong>Date Issued:</strong> {{ $ctcDateIssued ?? now()->format('Y-m-d') }}</p>
            <p><strong>Amount Paid:</strong> <span style="font-family: DejaVu Sans;">&#8369;</span>{{ $ctcAmountPaid ?? '0.00' }}</p>
            <p><strong>Issued at:</strong> {{ $ctcIssuedAt ?? 'BRGY. II' }}</p>
        </div>
        <div class="qr-box">
            @if(isset($qrCodeImage))
                <img src="data:image/png;base64,{{ $qrCodeImage }}" alt="Certificate QR Code" style="width: 100px; height: 100px;">
            @else
                <div class="qr-placeholder">
                    QR CODE
                </div>
            @endif
        </div>
    </div>

    <!-- Note -->
    <div class="note">
        <p><strong>Note:</strong> This Certificate is valid for Six(6) months after the date of issue.</p>
    </div>

    <script>
        // Auto-print functionality
        window.onload = function() {
            window.print();
        };

        // Close window after printing (or canceling print)
        window.onafterprint = function() {
            window.close();
        };

        // Fallback for browsers that don't support onafterprint
        if (window.matchMedia) {
            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function(mql) {
                if (!mql.matches) {
                    // After print
                    window.close();
                }
            });
        }
    </script>

</body>

</html>