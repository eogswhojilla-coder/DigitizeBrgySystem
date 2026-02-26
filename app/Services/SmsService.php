<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class SmsService
{
    protected $apiKey;
    protected $senderId;
    protected $apiUrl = 'https://api.semaphore.co/api/v4/messages';

    public function __construct()
    {
        $this->apiKey = config('services.semaphore.api_key');
        $this->senderId = config('services.semaphore.sender_id', 'BARANGAY');
    }

    /**
     * Send SMS notification
     *
     * @param string $phoneNumber
     * @param string $message
     * @return bool
     */
    public function send($phoneNumber, $message)
    {
        // Skip if API key is not configured
        if (empty($this->apiKey) || $this->apiKey === 'your_semaphore_api_key_here') {
            Log::info("SMS not sent (API not configured): {$phoneNumber}");
            return false;
        }

        // Format phone number (remove spaces, dashes, etc.)
        $phoneNumber = $this->formatPhoneNumber($phoneNumber);

        if (!$this->isValidPhoneNumber($phoneNumber)) {
            Log::warning("Invalid phone number format: {$phoneNumber}");
            return false;
        }

        try {
            $response = Http::asForm()->post($this->apiUrl, [
                'apikey' => $this->apiKey,
                'number' => $phoneNumber,
                'message' => $message,
                'sendername' => $this->senderId,
            ]);

            if ($response->successful()) {
                Log::info("SMS sent successfully to {$phoneNumber}");
                return true;
            } else {
                Log::error("SMS failed to {$phoneNumber}: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("SMS error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Format phone number to standard format
     *
     * @param string $phoneNumber
     * @return string
     */
    protected function formatPhoneNumber($phoneNumber)
    {
        // Remove all non-numeric characters
        $phoneNumber = preg_replace('/[^0-9]/', '', $phoneNumber);

        // Convert to international format if it starts with 09
        if (substr($phoneNumber, 0, 2) === '09') {
            $phoneNumber = '+63' . substr($phoneNumber, 1);
        }

        // Add +63 if it starts with 63 but doesn't have +
        if (substr($phoneNumber, 0, 2) === '63' && substr($phoneNumber, 0, 1) !== '+') {
            $phoneNumber = '+' . $phoneNumber;
        }

        return $phoneNumber;
    }

    /**
     * Validate Philippine phone number
     *
     * @param string $phoneNumber
     * @return bool
     */
    protected function isValidPhoneNumber($phoneNumber)
    {
        // Philippine mobile numbers: +639xxxxxxxxx (13 characters with +)
        // Or 09xxxxxxxxx (11 characters)
        $pattern = '/^(\+639|09)\d{9}$/';
        return preg_match($pattern, $phoneNumber);
    }

    /**
     * Send blotter notification via SMS
     *
     * @param string $phoneNumber
     * @param array $data
     * @return bool
     */
    public function sendBlotterNotification($phoneNumber, $data)
    {
        $barangayName = config('app.barangay_name', 'Barangay Office');
        $caseNumber = $data['case_number'] ?? 'N/A';
        $incident = $data['incident'] ?? 'incident';
        $status = $data['status'] ?? 'pending';

        $message = "{$barangayName} ALERT:\n\n";
        $message .= "You have been named in a blotter case.\n";
        $message .= "Case #: {$caseNumber}\n";
        $message .= "Incident: {$incident}\n";
        $message .= "Status: {$status}\n\n";
        $message .= "Please contact the barangay office for more information.";

        return $this->send($phoneNumber, $message);
    }
}
