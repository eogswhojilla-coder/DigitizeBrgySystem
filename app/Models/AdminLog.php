<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'message',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the user that owns the log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper method to create a log entry
     */
    public static function createLog($userId, $action, $message, $request = null)
    {
        return self::create([
            'user_id' => $userId,
            'action' => $action,
            'message' => $message,
            'ip_address' => $request ? $request->ip() : null,
            'user_agent' => $request ? $request->userAgent() : null,
        ]);
    }
}
