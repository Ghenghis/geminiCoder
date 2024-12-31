
import React, { useState } from 'react';
import { Download, GitHub, Upload, RefreshCw, Plus } from 'lucide-react';

export default function FileManager() {
  const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, show: false, type: '' });

  const handleContextMenu = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, show: true, type });
  };

  const downloadAsZip = async () => {
    const response = await fetch('/api/downloadProject');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Project Files</h2>
        <div className="flex gap-2">
          <button onClick={downloadAsZip} className="p-1 hover:bg-gray-700 rounded" title="Download as ZIP">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded" title="Upload to GitHub">
            <GitHub className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded" title="Upload Project">
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {/* File tree structure will be populated here */}
        <div onContextMenu={(e) => handleContextMenu(e, 'file')} className="cursor-pointer hover:bg-gray-800 p-2 rounded">
          File 1
        </div>
      </div>

      {contextMenu.show && (
        <div
          className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Check for bugs</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Improve code</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Update file</button>
        </div>
      )}
    </div>
  );
}
