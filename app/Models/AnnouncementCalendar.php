<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AnnouncementCalendar extends Model
{
    protected $fillable = [
        'news_feed_id',
        'type',
    ];

    public function activity(): HasOne
    {
        return $this->hasOne(Announcement::class, 'id', 'news_feed_id');
    }
}
