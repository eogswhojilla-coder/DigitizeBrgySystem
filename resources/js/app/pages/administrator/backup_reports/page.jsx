import React, { useState } from 'react';
import Layout from '../layout';
import { Download, X, Upload, RefreshCw } from 'lucide-react';

export default function Page() {
  return (
    <Layout>
      <BackupManager />
    </Layout>
  );
}

function BackupManager() {
  const [backupFiles] = useState([
    { name: 'BackupFile-04132025_065352.sql' },
    { name: 'BackupFile-04052025_101341.sql' },
    { name: 'BackupFile-04012025_071908.sql' }
  ]);

  const handleGenerateBackup = () => {
    console.log('Generating backup...');
  };

  const handleUpload = () => {
    console.log('Opening file upload...');
  };

  const handleRestore = () => {
    console.log('Restoring backup...');
  };

  const handleDownload = (fileName) => {
    console.log(`Downloading ${fileName}...`);
  };

  const handleDelete = (fileName) => {
    console.log(`Deleting ${fileName}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Upload Backup Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Upload Backup</h2>
              
              <button 
                onClick={handleGenerateBackup}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md flex items-center gap-2 mb-6 transition-colors"
              >
                <RefreshCw size={16} />
                Generate Backup
              </button>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div onClick={handleUpload} className="space-y-2">
                  <Upload size={32} className="mx-auto text-gray-500" />
                  <p className="text-gray-600 font-medium">Click Here to Upload</p>
                  <p className="text-gray-500 text-sm">No File Size Limit</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRestore}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Restore
            </button>
          </div>

          {/* Backup File Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-6">Backup File</h2>
            
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="font-semibold text-gray-700">File Name</div>
                <div className="font-semibold text-gray-700 text-center">Action</div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-gray-200">
                {backupFiles.map((file, index) => (
                  <div key={index} className="grid grid-cols-2 px-4 py-4 hover:bg-gray-50 transition-colors">
                    <div className="text-gray-800 font-medium">{file.name}</div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDownload(file.name)}
                        className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}