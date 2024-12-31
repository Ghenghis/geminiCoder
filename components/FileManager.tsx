
import React, { useState, useEffect } from 'react';
import { Download, GitHub, Upload, RefreshCw, Plus, Folder, FileText } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileItem[];
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, show: false, type: '', path: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
    const handleClick = () => setContextMenu(prev => ({ ...prev, show: false }));
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, type: string, path: string) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, show: true, type, path });
  };

  const downloadAsZip = async () => {
    try {
      const response = await fetch('/api/downloadProject');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading project:', error);
    }
  };

  const handleGitHubUpload = async () => {
    try {
      const response = await fetch('/api/githubUpload', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error uploading to GitHub:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('/api/uploadProject', {
        method: 'POST',
        body: formData,
      });
      await fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleContextAction = async (action: string) => {
    try {
      await fetch('/api/fileAction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          path: contextMenu.path,
          type: contextMenu.type,
        }),
      });
      await fetchFiles();
    } catch (error) {
      console.error('Error performing file action:', error);
    }
    setContextMenu(prev => ({ ...prev, show: false }));
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.path} style={{ marginLeft: `${level * 16}px` }}>
        <div
          onContextMenu={(e) => handleContextMenu(e, item.type, item.path)}
          className="cursor-pointer hover:bg-gray-800 p-2 rounded flex items-center gap-2"
        >
          {item.type === 'directory' ? (
            <Folder className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {item.name}
        </div>
        {item.children && renderFileTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Project Files</h2>
        <div className="flex gap-2">
          <button onClick={downloadAsZip} className="p-1 hover:bg-gray-700 rounded" title="Download as ZIP">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={handleGitHubUpload} className="p-1 hover:bg-gray-700 rounded" title="Upload to GitHub">
            <GitHub className="w-4 h-4" />
          </button>
          <label className="p-1 hover:bg-gray-700 rounded cursor-pointer" title="Upload Project">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".zip"
            />
          </label>
        </div>
      </div>
      
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-6rem)]">
        {renderFileTree(files)}
      </div>

      {contextMenu.show && (
        <div
          className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            onClick={() => handleContextAction('checkBugs')}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Check for bugs
          </button>
          <button 
            onClick={() => handleContextAction('improve')}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Improve code
          </button>
          <button 
            onClick={() => handleContextAction('update')}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Update file
          </button>
        </div>
      )}
    </div>
  );
}
