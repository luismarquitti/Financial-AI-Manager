
import React, { useState, useCallback } from 'react';
import { UploadIcon, DatabaseIcon } from './Icons';

interface DataInputProps {
  onFileSelect: (file: File) => void;
  onFetchFromDb: () => void;
  isLoading: boolean;
}

export const DataInput: React.FC<DataInputProps> = ({ onFileSelect, onFetchFromDb, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'database' | 'upload'>('database');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDbFetch = useCallback(() => {
    onFetchFromDb();
  }, [onFetchFromDb]);

  return (
    <div className="bg-card shadow-lg rounded-xl p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-text-primary mb-2">Welcome to Financial AI Manager</h2>
      <p className="text-center text-text-secondary mb-8">Get started by connecting to the database or importing your transaction data from a file.</p>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-3 text-center font-semibold flex items-center justify-center gap-2 ${activeTab === 'database' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:bg-gray-50'}`}
        >
          <DatabaseIcon /> Connect to Database
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 text-center font-semibold flex items-center justify-center gap-2 ${activeTab === 'upload' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:bg-gray-50'}`}
        >
          <UploadIcon /> Import File
        </button>
      </div>
      
      {activeTab === 'database' && (
        <div className="text-center h-48 flex flex-col justify-center items-center bg-gray-50 rounded-lg p-4">
            <DatabaseIcon className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-text-primary">Connect & Manage Your Data</h3>
            <p className="text-sm text-text-secondary mt-1 max-w-md">
                Load data from the database to enable full CRUD operations and interactive analysis.
            </p>
            <div className="mt-6">
                 <button
                    onClick={handleDbFetch}
                    disabled={isLoading}
                    className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Connecting...
                        </>
                    ) : 'Connect & Fetch Transactions'}
                 </button>
            </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="flex flex-col items-center justify-center w-full">
            <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon />
                    <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-text-secondary">CSV or XLSX file</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} disabled={isLoading} />
            </label>
             {isLoading && (
                <div className="mt-4 flex items-center text-text-secondary">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing file...
                </div>
            )}
        </div> 
      )}
    </div>
  );
};