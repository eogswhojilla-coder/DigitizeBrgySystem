<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArchivedResident extends Model
{
    protected $fillable = [
        'resident_id',
        'archive_reason',
        'archive_notes',
        'archive_date',
        'archived_by',
        'resident_number',
        'full_name',
        'contact_number',
        'address',
        'was_official',
        'position_held',
    ];

    protected $casts = [
        'archive_date' => 'date',
        'was_official' => 'boolean',
    ];

    /**
     * Get the resident that was archived
     */
    public function resident()
    {
        return $this->belongsTo(BarangayResident::class, 'resident_id');
    }

    /**
     * Get human-readable archive reason
     */
    public function getArchiveReasonLabelAttribute()
    {
        $reasons = [
            'moved_out' => 'Moved out of the barangay',
            'passed_away' => 'Passed away',
            'duplicate_entry' => 'Duplicate entry',
            'lost_jurisdiction' => 'Lost jurisdiction eligibility',
            'inactive_years' => 'Inactive for many years',
        ];

        return $reasons[$this->archive_reason] ?? $this->archive_reason;
    }
}
