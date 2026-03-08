<?php

namespace App\Http\Controllers;

use App\Models\AnnouncementCalendar;
use Illuminate\Http\Request;

class AnnouncementCalendarController extends Controller
{
    public function index()
    {
        $calendars = AnnouncementCalendar::with('activity.files')->get();
        return response()->json($calendars);
    }

    public function show($id)
    {
        $calendar = AnnouncementCalendar::with('activity.files')->findOrFail($id);
        return response()->json($calendar);
    }
}
