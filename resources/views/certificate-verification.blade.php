<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate Verification - Barangay II</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .header-logo svg {
            width: 50px;
            height: 50px;
            color: #667eea;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
        }

        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .status-valid {
            background: #d4edda;
            color: #155724;
            border: 2px solid #c3e6cb;
        }

        .status-invalid {
            background: #f8d7da;
            color: #721c24;
            border: 2px solid #f5c6cb;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e9ecef;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: 600;
            color: #495057;
            font-size: 14px;
        }

        .info-value {
            color: #212529;
            font-size: 14px;
            text-align: right;
            max-width: 60%;
            word-break: break-word;
        }

        .amount-highlight {
            font-size: 18px;
            font-weight: 700;
            color: #28a745;
        }

        .not-found {
            text-align: center;
            padding: 40px 30px;
        }

        .not-found svg {
            width: 80px;
            height: 80px;
            color: #dc3545;
            margin-bottom: 20px;
        }

        .not-found h2 {
            color: #dc3545;
            margin-bottom: 10px;
            font-size: 22px;
        }

        .not-found p {
            color: #6c757d;
            font-size: 14px;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }

        .footer-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .footer-logo img {
            width: 30px;
            height: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        @if($found)
            <!-- Valid Certificate -->
            <div class="header">
                <div class="header-logo">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h1>Certificate Verified</h1>
                <p>Barangay II, San Carlos City</p>
            </div>

            <div class="content">
                <div class="status-badge status-valid">✓ Valid Certificate</div>

                <div class="info-row">
                    <span class="info-label">Certificate No.</span>
                    <span class="info-value"><strong>{{ $certificateNumber }}</strong></span>
                </div>

                <div class="info-row">
                    <span class="info-label">Request ID</span>
                    <span class="info-value">#{{ $requestId }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Certificate Type</span>
                    <span class="info-value">{{ $certificateType }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Resident Name</span>
                    <span class="info-value">{{ $residentName }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Date Issued</span>
                    <span class="info-value">{{ $issuedDate }}</span>
                </div>

                @if($amountPaid > 0)
                <div class="info-row">
                    <span class="info-label">Amount Paid</span>
                    <span class="info-value amount-highlight">₱{{ number_format($amountPaid, 2) }}</span>
                </div>
                @else
                <div class="info-row">
                    <span class="info-label">Fee Status</span>
                    <span class="info-value">No Fee Required</span>
                </div>
                @endif

                <div class="info-row">
                    <span class="info-label">Payment Status</span>
                    <span class="info-value">
                        @if($paymentStatus == 'VERIFIED')
                            <span style="color: #28a745;">✓ Verified</span>
                        @elseif($paymentStatus == 'FOR_VERIFICATION')
                            <span style="color: #ffc107;">⏳ Pending</span>
                        @else
                            <span style="color: #6c757d;">{{ $paymentStatus }}</span>
                        @endif
                    </span>
                </div>
            </div>

            <div class="footer">
                <div class="footer-logo">
                    <strong>Barangay II Digital System</strong>
                </div>
                <p>This is an official verification from Barangay II, San Carlos City, Negros Occidental</p>
                <p style="margin-top: 5px; font-size: 11px;">Verified on {{ date('F d, Y \a\t h:i A') }}</p>
            </div>
        @else
            <!-- Invalid Certificate -->
            <div class="header" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);">
                <div class="header-logo" style="background: #f8d7da;">
                    <svg fill="none" stroke="#dc3545" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h1>Verification Failed</h1>
                <p>Barangay II, San Carlos City</p>
            </div>

            <div class="not-found">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <h2>Certificate Not Found</h2>
                <p>{{ $message ?? 'The certificate you are trying to verify does not exist or has been revoked.' }}</p>
                <p style="margin-top: 15px; font-size: 13px; color: #495057;">
                    Please contact Barangay II office for assistance.
                </p>
            </div>

            <div class="footer">
                <div class="footer-logo">
                    <strong>Barangay II Digital System</strong>
                </div>
                <p>If you believe this is an error, please visit the Barangay office</p>
            </div>
        @endif
    </div>
</body>
</html>
