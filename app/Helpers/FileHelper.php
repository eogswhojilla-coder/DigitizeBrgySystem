<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;

class FileHelper
{
    /**
     * Convert an uploaded file to a base64 data URI string.
     */
    public static function toBase64(UploadedFile $file): string
    {
        $contents = file_get_contents($file->getRealPath());
        $mimeType = $file->getMimeType();
        return 'data:' . $mimeType . ';base64,' . base64_encode($contents);
    }
}
