<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\BarangayHighlightController;
use App\Http\Controllers\ProfileController;
use App\Models\Announcement;
use App\Models\BarangayHighlight;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $announcements = Announcement::with(['files'])
        ->where('status', 'active')
        ->orderBy('created_at', 'desc')
        ->take(6)
        ->get()
        ->map(function ($announcement) {
            return [
                'id' => $announcement->id,
                'title' => $announcement->name,
                'description' => $announcement->description,
                'date' => $announcement->start_at->format('F d, Y'),
                'image' => $announcement->files->first()?->file_path ?? null,
            ];
        });

    // Fetch active barangay highlights
    $highlights = BarangayHighlight::where('is_active', true)
        ->orderBy('order', 'asc')
        ->get()
        ->map(function ($highlight) {
            return [
                'id' => $highlight->id,
                'image' => $highlight->image,
                'title' => $highlight->title,
                'description' => $highlight->description,
                'tag' => $highlight->category,
                'alt' => $highlight->title,
            ];
        });

    return Inertia::render('auth/login/page', [
        'announcements' => $announcements,
        'highlights' => $highlights,
    ]);
})->name('home');

// Login page route
Route::get('/auth/login', function () {
    return Inertia::render('auth/login/login-page');
})->name('login');

// Register page route (if needed)
Route::get('/auth/register', function () {
    return Inertia::render('auth/register/page');
})->name('register');

// Login form submission
Route::post('/auth/login', [LoginController::class, 'store'])->name('login.store');

// Logout
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

// ADMIN ROUTES - Protected by auth:sanctum AND role:admin
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('administrator')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('administrator/dashboard/page');
    })->name('dashboard');

    Route::prefix('barangay_residents')->group(function () {
        Route::get('new_official', function () {
            return Inertia::render('administrator/barangay_residents/new_official/page');
        });
        Route::get('list_of_official', function () {
            return Inertia::render('administrator/barangay_residents/list_of_official/page');
        });

        Route::get('list_of_official/{id}', function () {
            return Inertia::render('administrator/barangay_residents/list_of_official/id/page');
        });
        Route::get('list_of_resident', function () {
            return Inertia::render('administrator/barangay_residents/list_of_resident/page');
        });
        Route::get('archive_resident', function () {
            return Inertia::render('administrator/barangay_residents/archive_resident/page');
        });
        Route::get('official_end_term', function () {
            return Inertia::render('administrator/barangay_residents/official_end_term/page');
        });
        Route::get('account_approval', function () {
            return Inertia::render('administrator/barangay_residents/account_approval/page');
        });
    });
    // Route::get('account_approval', function () {
    //     return Inertia::render('administrator/account_approval/page');
    // });


    // Route::prefix('resident')->group(function () {
    //     Route::get('archive_resident', function () {
    //         return Inertia::render('administrator/resident/archive_resident/page');
    //     });
    //     Route::get('list_of_resident', function () {
    //         return Inertia::render('administrator/resident/list_of_resident/page');
    //     });
    // });

    Route::prefix('certificate')->group(function () {
        Route::get('certificate_layout', function () {
            return Inertia::render('administrator/certificate/certificate_layout/page');
        });
        Route::get('certificate_pending', function () {
            return Inertia::render('administrator/certificate/certificate_pending/page');
        });
        Route::get('certificate', function () {
            return Inertia::render('administrator/certificate/certificate/page');
        });
    });

    Route::prefix('users')->group(function () {
        Route::get('{type}', function () {
            return Inertia::render('administrator/users/slug/page');
        });
    });

    Route::prefix('user')->group(function () {
        Route::get('administrator_user', function () {
            return Inertia::render('administrator/user/administrator_user/page');
        });
        Route::get('resident_user', function () {
            return Inertia::render('administrator/user/resident_user/page');
        });
    });

    Route::prefix('family_profile')->group(function () {
        Route::get('create_new_family', function () {
            return Inertia::render('administrator/family_profile/create_new_family/page');
        });
        Route::get('add_family_members', function () {
            return Inertia::render('administrator/family_profile/add_family_members/page');
        });
        Route::get('household_details', function () {
            return Inertia::render('administrator/family_profile/household_details/page');
        });
        Route::get('list_of_family', function () {
            return Inertia::render('administrator/family_profile/list_of_family/page');
        });
    });

    Route::get('position', function () {
        return Inertia::render('administrator/position/page');
    });

    Route::get('blotter_record', function () {
        return Inertia::render('administrator/blotter_record/page');
    });

    Route::prefix('announcement')->group(function () {
        Route::get('add_announcement', function () {
            return Inertia::render('administrator/announcement/add_announcement/page');
        });
        Route::get('announcement_list', function () {
            return Inertia::render('administrator/announcement/announcement_list/page');
        });
        Route::get('calendar', function () {
            return Inertia::render('administrator/announcement/calendar/page');
        });
    });

    // Barangay Highlights Management
    Route::prefix('highlights')->name('admin.highlights.')->group(function () {
        Route::get('/', [BarangayHighlightController::class, 'index'])->name('index');
        Route::get('/create', [BarangayHighlightController::class, 'create'])->name('create');
        Route::post('/', [BarangayHighlightController::class, 'store'])->name('store');
        Route::get('/{highlight}/edit', [BarangayHighlightController::class, 'edit'])->name('edit');
        Route::put('/{highlight}', [BarangayHighlightController::class, 'update'])->name('update');
        Route::delete('/{highlight}', [BarangayHighlightController::class, 'destroy'])->name('destroy');
        Route::post('/{highlight}/toggle-active', [BarangayHighlightController::class, 'toggleActive'])->name('toggle-active');
    });

    Route::get('reports', function () {
        return Inertia::render('administrator/reports/page');
    });

    Route::prefix('inventory')->group(function () {
        Route::get('list_of_inventory', function () {
            return Inertia::render('administrator/inventory/list_of_inventory/page');
        });
        Route::get('approved_inventory_request', function () {
            return Inertia::render('administrator/inventory/approved_inventory_request/page');
        });
        Route::get('view_inventory_report', function () {
            return Inertia::render('administrator/inventory/view_inventory_report/page');
        });
    });

    Route::get('system_logs', function () {
        return Inertia::render('administrator/system_logs/page');
    });

    Route::get('backup_reports', function () {
        return Inertia::render('administrator/backup_reports/page');
    });

    Route::get('settings', function () {
        return Inertia::render('administrator/settings/page');
    });
});

// RESIDENT ROUTES - Protected by auth:sanctum AND role:resident
Route::middleware(['auth:sanctum', 'role:resident'])->prefix('resident')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('resident/dashboard/page');
    })->name('resident.dashboard');

    Route::get('announcements', function () {
        return Inertia::render('resident/announcements/page');
    })->name('resident.announcements');

    Route::get('certificate-request', function () {
        return Inertia::render('resident/certificate-request/page');
    })->name('resident.certificate-request');

    Route::get('inventory-borrow', function () {
        return Inertia::render('resident/inventory-borrow/page');
    })->name('resident.inventory-borrow');

    Route::get('blotter-notifications', function () {
        return Inertia::render('resident/blotter-notifications/page');
    })->name('resident.blotter-notifications');

    Route::get('profile', function () {
        return Inertia::render('resident/profile/page');
    })->name('resident.profile');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
