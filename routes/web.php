<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user(); // ✅ Get the logged-in user

        if ($user->role === 'admin') {
            return redirect('/administrator/dashboard');
        } elseif ($user->role === 'resident') {
            return redirect('/resident-portal/dashboard/');
        }
    }

    // If not logged in → go to login page
    return Inertia::render('auth/login/page');
})->name('login');




// Register Route
Route::get('/auth/register', function () {
    return Inertia::render('auth/register/page');
})->name('register');

Route::middleware('auth:sanctum')->prefix('administrator')->group(function () {
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
        Route::get('official_end_term', function () {
            return Inertia::render('administrator/barangay_residents/official_end_term/page');
        });
    });

    Route::prefix('resident')->group(function () {
        Route::get('archive_resident', function () {
            return Inertia::render('administrator/resident/archive_resident/page');
        });
        Route::get('list_of_resident', function () {
            return Inertia::render('administrator/resident/list_of_resident/page');
        });
    });

    Route::prefix('certificate')->group(function () {
        Route::get('certificate_layout', function () {
            return Inertia::render('administrator/certificate/certificate_layout/page');
        });
        Route::get('certificate_pending', function () {
            return Inertia::render('administrator/certificate/certificate_pending/page');
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

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
