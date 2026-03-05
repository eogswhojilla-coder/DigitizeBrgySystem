<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
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

            $database = config('database.connections.mysql.database');
            $username = config('database.connections.mysql.username');
            $password = config('database.connections.mysql.password');
            $host = config('database.connections.mysql.host');
            $port = config('database.connections.mysql.port', 3306);

            // Try to find mysqldump executable
            $mysqldumpPath = $this->findMysqldump();

            if ($mysqldumpPath) {
                // Use mysqldump command
                $success = $this->backupUsingMysqldump($mysqldumpPath, $host, $port, $username, $password, $database, $filepath);
            } else {
                // Fallback to PHP-based backup
                $success = $this->backupUsingPHP($database, $filepath);
            }

            if ($success && File::exists($filepath) && File::size($filepath) > 0) {
                return back()->with('success', 'Database backup created successfully!');
            } else {
                // Clean up empty file if it exists
                if (File::exists($filepath)) {
                    File::delete($filepath);
                }
                return back()->with('error', 'Failed to create database backup. The backup file is empty.');
            }

        } catch (\Exception $e) {
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    /**
     * Find mysqldump executable path
     */
    private function findMysqldump()
    {
        // Common paths for mysqldump on Windows
        $possiblePaths = [
            'C:\xampp\mysql\bin\mysqldump.exe',
            'C:\wamp\bin\mysql\mysql8.0.27\bin\mysqldump.exe',
            'C:\wamp64\bin\mysql\mysql8.0.27\bin\mysqldump.exe',
            'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe',
            'C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqldump.exe',
            'mysqldump', // Try system PATH
        ];

        foreach ($possiblePaths as $path) {
            // For system PATH command, check if it's available
            if ($path === 'mysqldump') {
                exec('where mysqldump 2>nul', $output, $returnVar);
                if ($returnVar === 0 && !empty($output)) {
                    return 'mysqldump';
                }
            } else {
                if (File::exists($path)) {
                    return $path;
                }
            }
        }

        return null;
    }

    /**
     * Backup using mysqldump command
     */
    private function backupUsingMysqldump($mysqldumpPath, $host, $port, $username, $password, $database, $filepath)
    {
        try {
            // Build the command with proper escaping for Windows
            $command = sprintf(
                '"%s" --user=%s --host=%s --port=%d --single-transaction --routines --triggers %s %s > "%s" 2>&1',
                $mysqldumpPath,
                $username,
                $host,
                $port,
                $password ? '--password=' . $password : '',
                $database,
                $filepath
            );

            exec($command, $output, $returnVar);

            // Check if backup was successful
            return ($returnVar === 0 && File::exists($filepath) && File::size($filepath) > 0);

        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Backup using PHP (fallback method)
     */
    private function backupUsingPHP($database, $filepath)
    {
        try {
            $tables = DB::select('SHOW TABLES');
            $tableKey = 'Tables_in_' . $database;
            
            $sql = "-- Database Backup\n";
            $sql .= "-- Generated: " . Carbon::now() . "\n";
            $sql .= "-- Database: {$database}\n\n";
            $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

            foreach ($tables as $table) {
                $tableName = $table->$tableKey;
                
                // Get CREATE TABLE statement
                $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
                $sql .= "-- Table: {$tableName}\n";
                $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
                $sql .= $createTable[0]->{'Create Table'} . ";\n\n";

                // Get table data
                $rows = DB::select("SELECT * FROM `{$tableName}`");
                
                if (!empty($rows)) {
                    $sql .= "-- Data for table {$tableName}\n";
                    
                    foreach ($rows as $row) {
                        $values = array_map(function($value) {
                            if ($value === null) {
                                return 'NULL';
                            }
                            return "'" . addslashes($value) . "'";
                        }, (array) $row);
                        
                        $sql .= "INSERT INTO `{$tableName}` VALUES (" . implode(', ', $values) . ");\n";
                    }
                    
                    $sql .= "\n";
                }
            }

            $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

            // Write to file
            File::put($filepath, $sql);

            return File::exists($filepath) && File::size($filepath) > 0;

        } catch (\Exception $e) {
            Log::error('Backup error: ' . $e->getMessage());
            return false;
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

            $database = config('database.connections.mysql.database');
            $username = config('database.connections.mysql.username');
            $password = config('database.connections.mysql.password');
            $host = config('database.connections.mysql.host');
            $port = config('database.connections.mysql.port', 3306);

            // Try to find mysql executable
            $mysqlPath = $this->findMysql();

            if ($mysqlPath) {
                // Use mysql command
                $success = $this->restoreUsingMysql($mysqlPath, $host, $port, $username, $password, $database, $filepath);
            } else {
                // Fallback to PHP-based restore
                $success = $this->restoreUsingPHP($filepath);
            }

            if ($success) {
                return back()->with('success', 'Database restored successfully!');
            } else {
                return back()->with('error', 'Failed to restore database. Please check the backup file.');
            }

        } catch (\Exception $e) {
            return back()->with('error', 'Error restoring database: ' . $e->getMessage());
        }
    }

    /**
     * Find mysql executable path
     */
    private function findMysql()
    {
        // Common paths for mysql on Windows
        $possiblePaths = [
            'C:\xampp\mysql\bin\mysql.exe',
            'C:\wamp\bin\mysql\mysql8.0.27\bin\mysql.exe',
            'C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe',
            'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe',
            'C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe',
            'mysql', // Try system PATH
        ];

        foreach ($possiblePaths as $path) {
            // For system PATH command, check if it's available
            if ($path === 'mysql') {
                exec('where mysql 2>nul', $output, $returnVar);
                if ($returnVar === 0 && !empty($output)) {
                    return 'mysql';
                }
            } else {
                if (File::exists($path)) {
                    return $path;
                }
            }
        }

        return null;
    }

    /**
     * Restore using mysql command
     */
    private function restoreUsingMysql($mysqlPath, $host, $port, $username, $password, $database, $filepath)
    {
        try {
            // Build the command with proper escaping for Windows
            $command = sprintf(
                '"%s" --user=%s --host=%s --port=%d %s %s < "%s" 2>&1',
                $mysqlPath,
                $username,
                $host,
                $port,
                $password ? '--password=' . $password : '',
                $database,
                $filepath
            );

            exec($command, $output, $returnVar);

            return ($returnVar === 0);

        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Restore using PHP (fallback method)
     */
    private function restoreUsingPHP($filepath)
    {
        try {
            // Read the SQL file
            $sql = File::get($filepath);

            // Split into individual queries
            $queries = array_filter(
                array_map('trim', explode(';', $sql)),
                function($query) {
                    return !empty($query) && !preg_match('/^--/', $query);
                }
            );

            // Execute each query
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
            
            foreach ($queries as $query) {
                if (!empty(trim($query))) {
                    DB::statement($query);
                }
            }
            
            DB::statement('SET FOREIGN_KEY_CHECKS=1');

            return true;

        } catch (\Exception $e) {
            Log::error('Restore error: ' . $e->getMessage());
            return false;
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
