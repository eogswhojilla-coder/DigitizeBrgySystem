<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'name',
        'description',
        'start_at',
        'end_at',
        'status',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];

    public function files()
    {
        return $this->hasMany(AnnouncementFile::class, 'news_feed_id');
    }

    public function calendar()
    {
        return $this->hasOne(AnnouncementCalendar::class, 'news_feed_id');
    }
}
