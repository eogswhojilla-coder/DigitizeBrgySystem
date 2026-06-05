<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatbotMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_message',
        'bot_response',
        'user_id',
        'ip_address',
        'is_helpful',
    ];

    protected $casts = [
        'is_helpful' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the message
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
