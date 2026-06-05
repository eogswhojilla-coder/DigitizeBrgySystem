<?php

namespace App\Http\Controllers;

use App\Models\ChatbotMessage;
use App\Models\CertificateType;
use App\Models\Announcement;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    /**
     * Get predefined prompts/FAQs for residents
     */
    public function getPrompts()
    {
        $prompts = [
            [
                'id' => 1,
                'question' => 'How do I request a barangay clearance?',
                'category' => 'certificates'
            ],
            [
                'id' => 2,
                'question' => 'What are the requirements for indigency certificate?',
                'category' => 'certificates'
            ],
            [
                'id' => 3,
                'question' => 'What are the operating hours of the barangay hall?',
                'category' => 'general'
            ],
            [
                'id' => 4,
                'question' => 'How can I report a complaint or blotter?',
                'category' => 'blotter'
            ],
            [
                'id' => 5,
                'question' => 'What services are available in our barangay?',
                'category' => 'services'
            ],
            [
                'id' => 6,
                'question' => 'How do I register my account?',
                'category' => 'account'
            ],
            [
                'id' => 7,
                'question' => 'What are the latest announcements?',
                'category' => 'announcements'
            ],
            [
                'id' => 8,
                'question' => 'Who are the barangay officials?',
                'category' => 'officials'
            ],
            [
                'id' => 9,
                'question' => 'How do I borrow equipment from the barangay?',
                'category' => 'inventory'
            ],
        ];

        return response()->json([
            'success' => true,
            'prompts' => $prompts
        ]);
    }

    /**
     * Send a message and get bot response
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
            'session_id' => 'required|string'
        ]);

        $userMessage = $request->message;
        $sessionId = $request->session_id;

        // Get bot response based on message content
        $botResponse = $this->generateResponse($userMessage);

        // Store the conversation
        $chatMessage = ChatbotMessage::create([
            'session_id' => $sessionId,
            'user_message' => $userMessage,
            'bot_response' => $botResponse,
            'user_id' => Auth::id(),
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'response' => $botResponse,
            'message_id' => $chatMessage->id
        ]);
    }

    /**
     * Generate intelligent response based on user message
     */
    private function generateResponse($message)
    {
        $message = trim($message);
        
        // Check for extreme profanity/abuse and handle immediately
        if ($this->containsProfanity($message)) {
            Log::warning('Chatbot received inappropriate message', [
                'message' => $message,
                'ip' => request()->ip()
            ]);
            
            return "I understand you may be frustrated. I'm here to help with barangay services.\n\n" .
                   "How can I assist you with:\n" .
                   "• Certificate requests\n" .
                   "• Equipment borrowing\n" .
                   "• Barangay information\n\n" .
                   "Please let me know what you need.";
        }
        
        // Try AI first if enabled and API key is configured
        if (config('services.gemini.api_key') && env('CHATBOT_USE_AI', true)) {
            try {
                $gemini = new GeminiService();
                
                // Get context (latest announcements)
                $announcements = Announcement::orderBy('created_at', 'desc')
                    ->take(3)
                    ->pluck('title')
                    ->toArray();
                
                $context = [
                    'announcements' => $announcements
                ];
                
                $aiResponse = $gemini->generateResponse($message, $context);
                
                if ($aiResponse) {
                    Log::info('Using AI response for chatbot');
                    return $aiResponse;
                }
                
                Log::warning('AI response failed, falling back to keyword matching');
            } catch (\Exception $e) {
                Log::error('AI generation error', ['error' => $e->getMessage()]);
            }
        }
        
        // Fall back to keyword-based responses
        Log::info('Using keyword-based response for chatbot');
        return $this->getKeywordResponse($message);
    }

    /**
     * Get keyword-based response (fallback method)
     */
    private function getKeywordResponse($message)
    {
        $message = strtolower(trim($message));

        // Barangay Clearance / Certificates
        if ($this->containsKeywords($message, ['clearance', 'barangay clearance', 'brgy clearance'])) {
            return "To request a Barangay Clearance:\n\n" .
                   "1. Log in to your resident account\n" .
                   "2. Go to 'Request Certificate' section\n" .
                   "3. Select 'Barangay Clearance'\n" .
                   "4. Fill out the required information\n" .
                   "5. Submit and wait for approval\n\n" .
                   "Processing time: 1-3 business days\n" .
                   "Fee: As per barangay ordinance\n\n" .
                   "You'll receive a notification once it's ready for pickup or payment.";
        }

        // Indigency Certificate
        if ($this->containsKeywords($message, ['indigency', 'indigent', 'indigency certificate'])) {
            return "For Indigency Certificate:\n\n" .
                   "Requirements:\n" .
                   "• Valid ID\n" .
                   "• Proof of residency\n" .
                   "• Certificate of No Income (if applicable)\n\n" .
                   "Steps:\n" .
                   "1. Request through the online system\n" .
                   "2. Upload required documents\n" .
                   "3. Wait for barangay verification\n" .
                   "4. Claim at the barangay hall\n\n" .
                   "This certificate is usually FREE for indigent residents.";
        }

        // Certificate of Residency
        if ($this->containsKeywords($message, ['residency', 'certificate of residency', 'proof of residence'])) {
            return "Certificate of Residency can be requested online:\n\n" .
                   "Requirements:\n" .
                   "• Valid government ID\n" .
                   "• Proof of address (utility bill, lease contract)\n" .
                   "• Resident registration in the system\n\n" .
                   "Process through the 'Request Certificate' menu after logging in.";
        }

        // Operating Hours
        if ($this->containsKeywords($message, ['hours', 'open', 'schedule', 'time', 'operating'])) {
            return "📍 Barangay Hall Operating Hours:\n\n" .
                   "Monday to Friday: 8:00 AM - 5:00 PM\n" .
                   "Lunch Break: 12:00 PM - 1:00 PM\n" .
                   "Saturday: 8:00 AM - 12:00 PM\n" .
                   "Sunday & Holidays: CLOSED\n\n" .
                   "💡 You can request certificates online 24/7 through this system!";
        }

        // Blotter/Complaints
        if ($this->containsKeywords($message, ['blotter', 'complaint', 'report', 'incident'])) {
            return "To file a Blotter or Complaint:\n\n" .
                   "1. Visit the barangay hall in person\n" .
                   "2. Proceed to the Barangay Tanod or Peace & Order desk\n" .
                   "3. Bring valid ID and any evidence\n" .
                   "4. Fill out the blotter form\n\n" .
                   "For emergencies, call:\n" .
                   "🚨 Barangay Emergency Hotline: [Contact Number]\n" .
                   "🚨 Police Emergency: 911\n\n" .
                   "Note: Blotter reports must be filed in person for legal purposes.";
        }

        // Services
        if ($this->containsKeywords($message, ['services', 'what services', 'available services', 'offer'])) {
            return "Available Barangay Services:\n\n" .
                   "📄 Certificate Issuance:\n" .
                   "   • Barangay Clearance\n" .
                   "   • Certificate of Residency\n" .
                   "   • Certificate of Indigency\n" .
                   "   • Good Moral Certificate\n\n" .                   "📦 Equipment Lending:\n" .
                   "   • Tables & Chairs\n" .
                   "   • Sound System\n" .
                   "   • Tents & Canopies\n" .
                   "   • Sports Equipment\n\n" .                   "🏥 Health Services\n" .
                   "🎓 Educational Assistance\n" .
                   "👮 Peace & Order (Blotter)\n" .
                   "📢 Community Announcements\n" .
                   "🏃 Sports & Recreation Programs\n\n" .
                   "Visit our services page for more details!";
        }

        // Account Registration
        if ($this->containsKeywords($message, ['register', 'sign up', 'account', 'create account', 'registration'])) {
            return "How to Register a Resident Account:\n\n" .
                   "1. Click 'Register' on the login page\n" .
                   "2. Fill out your personal information:\n" .
                   "   • Full name\n" .
                   "   • Date of birth\n" .
                   "   • Address\n" .
                   "   • Contact details\n" .
                   "   • Valid ID\n" .
                   "3. Submit your registration\n" .
                   "4. Wait for admin approval (1-2 days)\n" .
                   "5. Check your email for confirmation\n\n" .
                   "Once approved, you can request certificates and access other services!";
        }

        // Announcements
        if ($this->containsKeywords($message, ['announcement', 'news', 'update', 'latest', 'events'])) {
            $latestAnnouncements = Announcement::orderBy('created_at', 'desc')->take(3)->get(['title', 'created_at']);
            
            if ($latestAnnouncements->count() > 0) {
                $response = "📢 Latest Barangay Announcements:\n\n";
                foreach ($latestAnnouncements as $index => $announcement) {
                    $response .= ($index + 1) . ". " . $announcement->title . "\n";
                    $response .= "   Posted: " . $announcement->created_at->format('M d, Y') . "\n\n";
                }
                $response .= "Check the Announcements page for full details!";
                return $response;
            }
            
            return "No recent announcements at the moment. Please check back later or visit the announcements page.";
        }

        // Officials
        if ($this->containsKeywords($message, ['officials', 'barangay captain', 'kagawad', 'chairman', 'council'])) {
            return "👥 Barangay Officials:\n\n" .
                   "You can view the complete list of barangay officials, including:\n" .
                   "• Barangay Captain\n" .
                   "• Barangay Kagawads\n" .
                   "• SK Chairman\n" .
                   "• Barangay Secretary\n" .
                   "• Barangay Treasurer\n\n" .
                   "Visit the 'About' or 'Officials' section on our website for more information and contact details.";
        }

        // Inventory / Borrow Equipment
        if ($this->containsKeywords($message, ['borrow', 'equipment', 'inventory', 'item', 'rent', 'lending', 'tools', 'supplies'])) {
            return "📦 Barangay Equipment Borrowing System:\n\n" .
                   "How to Borrow Equipment:\n" .
                   "1. Log in to your resident account\n" .
                   "2. Go to 'Inventory' or 'Equipment' section\n" .
                   "3. Browse available items (chairs, tables, sound system, etc.)\n" .
                   "4. Click 'Request to Borrow'\n" .
                   "5. Fill out the borrow request form:\n" .
                   "   • Item needed\n" .
                   "   • Quantity\n" .
                   "   • Borrow date\n" .
                   "   • Return date\n" .
                   "   • Purpose\n" .
                   "6. Submit your request\n" .
                   "7. Wait for admin approval\n" .
                   "8. Pick up items at the barangay hall\n\n" .
                   "⚠️ Important Reminders:\n" .
                   "• Return items on time\n" .
                   "• Items must be in good condition\n" .
                   "• Valid ID required during pickup\n" .
                   "• Some items may require a deposit\n\n" .
                   "You'll receive notifications about your request status!";
        }

        // Payment
        if ($this->containsKeywords($message, ['payment', 'pay', 'fee', 'gcash', 'how to pay'])) {
            return "💳 Payment Options:\n\n" .
                   "We accept payments through:\n" .
                   "• GCash (Online)\n" .
                   "• Cash (At barangay hall)\n\n" .
                   "For online certificate requests:\n" .
                   "1. Submit your request\n" .
                   "2. Wait for approval\n" .
                   "3. Receive payment instructions via notification\n" .
                   "4. Pay through GCash or visit the hall\n" .
                   "5. Claim your certificate\n\n" .
                   "Always keep your payment receipt!";
        }

        // Contact
        if ($this->containsKeywords($message, ['contact', 'phone', 'email', 'reach', 'call'])) {
            return "📞 Contact Us:\n\n" .
                   "Barangay Hall:\n" .
                   "📍 Address: [Your Barangay Address]\n" .
                   "☎️ Phone: [Contact Number]\n" .
                   "📧 Email: [Email Address]\n" .
                   "📱 Facebook: [FB Page]\n\n" .
                   "Office Hours:\n" .
                   "Monday-Friday: 8:00 AM - 5:00 PM\n" .
                   "Saturday: 8:00 AM - 12:00 PM";
        }

        // Requirements (general)
        if ($this->containsKeywords($message, ['requirements', 'requirement', 'need', 'documents'])) {
            return "📋 General Requirements for Certificates:\n\n" .
                   "Most certificates require:\n" .
                   "• Valid Government ID\n" .
                   "• Proof of Residency\n" .
                   "• Registered resident account\n\n" .
                   "Specific requirements vary by certificate type. " .
                   "What certificate do you need? (Clearance, Indigency, Residency, etc.)";
        }

        // Greeting responses
        if ($this->containsKeywords($message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'kumusta', 'kamusta', 'maayong', 'musta'])) {
            return "Hello! 👋 Kumusta! Welcome to the Barangay AI Assistant.\n\n" .
                   "I can help you with:\n" .
                   "• Certificate requests\n" .
                   "• Equipment borrowing\n" .
                   "• Barangay services\n" .
                   "• Operating hours\n" .
                   "• Requirements\n" .
                   "• General inquiries\n\n" .
                   "How can I assist you today? / Unsaon nako pagtabang?";
        }

        // Thank you
        if ($this->containsKeywords($message, ['thank', 'thanks', 'salamat', 'daghang salamat'])) {
            return "You're welcome! / Walay sapayan! 😊\n\n" .
                   "If you have any other questions, feel free to ask. " .
                   "I'm here to help!\n\n" .
                   "Have a great day!";
        }

        // Default response - unclear or off-topic
        return "I'm specifically designed to help with **barangay services only**. 🏛️\n\n" .
               "I can't answer general questions (like math, homework, or trivia).\n\n" .
               "**What I CAN help you with:**\n" .
               "• Certificate requests (Clearance, Indigency, Residency)\n" .
               "• Equipment borrowing procedures\n" .
               "• Barangay services and programs\n" .
               "• Operating hours and schedules\n" .
               "• Requirements for documents\n" .
               "• Latest barangay announcements\n" .
               "• Contact information\n\n" .
               "Please ask a question about our barangay services, or select from the suggested prompts.";
    }

    /**
     * Check if message contains specific keywords
     */
    private function containsKeywords($message, $keywords)
    {
        foreach ($keywords as $keyword) {
            if (Str::contains($message, strtolower($keyword))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if message contains profanity or inappropriate content
     */
    private function containsProfanity($message)
    {
        $message = strtolower($message);
        
        // Common profanity list (English and Filipino)
        $profanityList = [
            'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard',
            'putang ina', 'tangina', 'gago', 'tarantado', 'bobo',
            'tanga', 'ulol', 'leche', 'puta', 'punyeta'
        ];
        
        foreach ($profanityList as $word) {
            if (Str::contains($message, $word)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get conversation history for a session
     */
    public function getHistory(Request $request)
    {
        $request->validate([
            'session_id' => 'required|string'
        ]);

        $messages = ChatbotMessage::where('session_id', $request->session_id)
            ->orderBy('created_at', 'asc')
            ->get(['user_message', 'bot_response', 'created_at']);

        return response()->json([
            'success' => true,
            'history' => $messages
        ]);
    }

    /**
     * Submit feedback on bot response
     */
    public function submitFeedback(Request $request)
    {
        $request->validate([
            'message_id' => 'required|exists:chatbot_messages,id',
            'is_helpful' => 'required|boolean'
        ]);

        $message = ChatbotMessage::findOrFail($request->message_id);
        $message->update(['is_helpful' => $request->is_helpful]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your feedback!'
        ]);
    }
}
