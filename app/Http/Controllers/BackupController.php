<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Carbon\Carbon;

class BackupController extends Controller
{
    private $backupPath;

    public function __construct()
    {
        $this->backupPath = storage_path('app/backups');
        
        // Create backup directory if it doesn't exist
        if (!File::exists($this->backupPath)) {
            File::makeDirectory($this->backupPath, 0755, true);
        }
    }

    /**
     * Display backup page with list of backups
     */
    public function index()
    {
        $backups = $this->getBackupFiles();
        
        return Inertia::render('administrator/backup_reports/page', [
            'backups' => $backups
        ]);
    }

    /**
     * Generate a new database backup
     */
    public function generate()
    {
        try {
            $timestamp = Carbon::now()->format('mdY_His');
            $filename = "BackupFile-{$timestamp}.sql";
            $filepath = $this->backupPath . '/' . $filename;

            $database = env('DB_DATABASE');
            $username = env('DB_USERNAME');
            $password = env('DB_PASSWORD');
            $host = env('DB_HOST');

            // MySQL dump command
            $command = sprintf(
                'mysqldump --user=%s --password=%s --host=%s %s > %s',
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($database),
                escapeshellarg($filepath)
            );

            // Execute the command
            exec($command, $output, $returnVar);

            if ($returnVar === 0 && File::exists($filepath)) {
                return back()->with('success', 'Database backup created successfully!');
            } else {
                return back()->with('error', 'Failed to create database backup.');
            }

        } catch (\Exception $e) {
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    /**
     * Download a backup file
     */
    public function download($filename)
    {
        $filepath = $this->backupPath . '/' . $filename;

        if (!File::exists($filepath)) {
            return back()->with('error', 'Backup file not found.');
        }

        return response()->download($filepath);
    }

    /**
     * Delete a backup file
     */
    public function delete($filename)
    {
        try {
            $filepath = $this->backupPath . '/' . $filename;

            if (!File::exists($filepath)) {
                return back()->with('error', 'Backup file not found.');
            }

            File::delete($filepath);

            return back()->with('success', 'Backup file deleted successfully!');

        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting backup: ' . $e->getMessage());
        }
    }

    /**
     * Upload a backup file
     */
    public function upload(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimes:sql|max:102400' // Max 100MB
        ]);

        try {
            $file = $request->file('backup_file');
            $filename = $file->getClientOriginalName();
            
            // If file exists, add timestamp to make it unique
            if (File::exists($this->backupPath . '/' . $filename)) {
                $timestamp = Carbon::now()->format('His');
                $filename = pathinfo($filename, PATHINFO_FILENAME) . '_' . $timestamp . '.sql';
            }

            $file->move($this->backupPath, $filename);

            return back()->with('success', 'Backup file uploaded successfully!');

        } catch (\Exception $e) {
            return back()->with('error', 'Error uploading backup: ' . $e->getMessage());
        }
    }

    /**
     * Restore database from backup file
     */
    public function restore(Request $request)
    {
        $request->validate([
            'filename' => 'required|string'
        ]);

        try {
            $filename = $request->input('filename');
            $filepath = $this->backupPath . '/' . $filename;

            if (!File::exists($filepath)) {
                return back()->with('error', 'Backup file not found.');
            }

            $database = env('DB_DATABASE');
            $username = env('DB_USERNAME');
            $password = env('DB_PASSWORD');
            $host = env('DB_HOST');

            // MySQL restore command
            $command = sprintf(
                'mysql --user=%s --password=%s --host=%s %s < %s',
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($database),
                escapeshellarg($filepath)
            );

            exec($command, $output, $returnVar);

            if ($returnVar === 0) {
                return back()->with('success', 'Database restored successfully!');
            } else {
                return back()->with('error', 'Failed to restore database.');
            }

        } catch (\Exception $e) {
            return back()->with('error', 'Error restoring database: ' . $e->getMessage());
        }
    }

    /**
     * Get list of backup files
     */
    private function getBackupFiles()
    {
        $files = File::files($this->backupPath);
        $backups = [];

        foreach ($files as $file) {
            if ($file->getExtension() === 'sql') {
                $backups[] = [
                    'name' => $file->getFilename(),
                    'size' => $this->formatBytes($file->getSize()),
                    'date' => Carbon::createFromTimestamp($file->getMTime())->format('M d, Y h:i A'),
                    'timestamp' => $file->getMTime()
                ];
            }
        }

        // Sort by timestamp (newest first)
        usort($backups, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });

        return $backups;
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
