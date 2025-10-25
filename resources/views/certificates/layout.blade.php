<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            width: 80px;
            height: 80px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
        }
        .subtitle {
            font-size: 18px;
            margin: 5px 0;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 50px;
        }
        .signature-line {
            margin-top: 80px;
            text-align: center;
            border-top: 1px solid black;
            width: 200px;
            display: inline-block;
        }
        .official-name {
            font-weight: bold;
            margin-top: 5px;
        }
        .official-title {
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ asset('images/logo.png') }}" alt="Barangay Logo" class="logo">
        <div class="title">Republic of the Philippines</div>
        <div class="subtitle">City of [City Name]</div>
        <div class="subtitle">Barangay [Barangay Name]</div>
    </div>

    <div class="content">
        @yield('content')
    </div>

    <div class="footer">
        <div style="float: right;">
            <div class="signature-line">
                <div class="official-name">[Official Name]</div>
                <div class="official-title">Barangay Captain</div>
            </div>
        </div>
    </div>
</body>
</html>