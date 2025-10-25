<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    public function generate(Certificate $certificate)
    {
        // Generate PDF using the template
        $pdf = PDF::loadView('certificates.template', [
            'certificate' => $certificate->load('certificateRequest.user')
        ]);

        // Save PDF to storage
        $fileName = 'certificate_' . $certificate->certificate_number . '.pdf';
        $path = 'certificates/' . $fileName;
        Storage::put($path, $pdf->output());

        // Update certificate with PDF path
        $certificate->update(['pdf_path' => $path]);

        return response()->json([
            'message' => 'Certificate generated successfully',
            'path' => $path
        ]);
    }

    public function download(Certificate $certificate)
    {
        if (!$certificate->pdf_path || !Storage::exists($certificate->pdf_path)) {
            return response()->json([
                'message' => 'Certificate PDF not found'
            ], 404);
        }

        return Storage::download(
            $certificate->pdf_path, 
            'certificate_' . $certificate->certificate_number . '.pdf'
        );
    }
}
