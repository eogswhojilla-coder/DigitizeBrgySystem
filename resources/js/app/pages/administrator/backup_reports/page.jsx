import React, { useState, useRef } from 'react';
import Layout from '../layout';
import { Download, X, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Page({ backups = [] }) {
  return (
    <Layout>
      <BackupManager backups={backups} />
    </Layout>
  );
}

function BackupManager({ backups }) {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { flash } = usePage().props;

  // Show flash messages
  React.useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: flash.success,
        timer: 3000,
        showConfirmButton: false
      });
    }
    if (flash?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: flash.error
      });
    }
  }, [flash]);

  const handleGenerateBackup = () => {
    Swal.fire({
      title: 'Generate Database Backup?',
      text: 'This will create a new backup of your database.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Generate!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        setGenerating(true);
        return router.post(route('backup.generate'), {}, {
          onFinish: () => setGenerating(false),
          preserveScroll: true
        });
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.sql')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select a valid .sql file'
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a backup file to upload.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('backup_file', selectedFile);

    setUploading(true);
    router.post(route('backup.upload'), formData, {
      onSuccess: () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onFinish: () => setUploading(false),
      preserveScroll: true
    });
  };

  const handleRestore = (filename) => {
    Swal.fire({
      title: 'Restore Database?',
      html: `<p>This will restore the database from:</p><p class="font-bold mt-2">${filename}</p><p class="text-red-600 mt-3">⚠️ This action will overwrite your current database!</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Restore!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return router.post(route('backup.restore'), { filename }, {
          preserveScroll: true
        });
      }
    });
  };

  const handleDownload = (filename) => {
    window.location.href = route('backup.download', filename);
  };

  const handleDelete = (filename) => {
    Swal.fire({
      title: 'Delete Backup?',
      text: `Delete ${filename}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('backup.delete', filename), {
          preserveScroll: true
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Database Backup & Restore</h1>
          <p className="text-gray-600 mt-2">Manage your database backups securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Upload Backup Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Upload & Generate Backup</h2>
              
              <button 
                onClick={handleGenerateBackup}
                disabled={generating}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md flex items-center gap-2 mb-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} className={generating ? 'animate-spin' : ''} />
                {generating ? 'Generating...' : 'Generate Backup'}
              </button>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".sql"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div onClick={handleUploadClick} className="space-y-2 cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-500" />
                  <p className="text-gray-600 font-medium">Click Here to Upload .sql File</p>
                  {selectedFile ? (
                    <p className="text-green-600 text-sm font-semibold">✓ {selectedFile.name}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">Only .sql files allowed</p>
                  )}
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Backups are stored in storage/app/backups</li>
                    <li>Restoring will overwrite current database</li>
                    <li>Always test backups before restoration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Backup File Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-600">Backup Files ({backups.length})</h2>
              <button
                onClick={() => router.reload({ only: ['backups'] })}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Refresh list"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            
            {backups.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Upload size={48} className="mx-auto mb-4 opacity-50" />
                <p>No backup files found</p>
                <p className="text-sm mt-2">Generate a new backup to get started</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-gray-100 px-4 py-3 border-b border-gray-200 text-sm">
                  <div className="font-semibold text-gray-700 col-span-2">File Name</div>
                  <div className="font-semibold text-gray-700 text-center">Action</div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {backups.map((file, index) => (
                    <div key={index} className="grid grid-cols-3 px-4 py-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-2">
                        <div className="text-gray-800 font-medium text-sm">{file.name}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          {file.size} • {file.date}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRestore(file.name)}
                          className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Restore"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(file.name)}
                          className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.name)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}