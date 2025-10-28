<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnnouncementFile extends Model
{
    protected $fillable = [
        'news_feed_id',
        'files',
        'type',
    ];
}
