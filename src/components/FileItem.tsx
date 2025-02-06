import React, { useState } from 'react';
import { File as FileIcon, Image, PenSquare, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import ContextMenu from './common/ContextMenu';
import ConfirmationDialog from './common/ConfirmationDialog';
import Canvas from './Canvas';

interface FileItemProps {
  file: {
    id: string;
    name: string;
    type: 'canvas' | 'image' | 'document';
  };
  projectId: string;
  onFileOpen?: () => void;
  onFileClose?: () => void;
}

export default function FileItem({ file, projectId, onFileOpen, onFileClose }: FileItemProps) {
  const { deleteFile, renameFile } = useProjects();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDelete = () => {
    deleteFile(projectId, file.id);
    setShowDeleteConfirm(false);
  };

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      renameFile(projectId, file.id, newName);
    }
    setShowRenameDialog(false);
  };

  const handleFileClick = () => {
    if (file.type === 'canvas') {
      setShowCanvas(true);
      onFileOpen?.();
    }
  };

  const getFileIcon = () => {
    switch (file.type) {
      case 'image':
        return Image;
      case 'canvas':
        return PenSquare;
      default:
        return FileIcon;
    }
  };

  const Icon = getFileIcon();

  const contextMenuItems = [
    {
      label: 'Rename',
      onClick: () => setShowRenameDialog(true),
      icon: Pencil
    },
    {
      label: 'Delete',
      onClick: () => setShowDeleteConfirm(true),
      icon: Trash2,
      danger: true
    }
  ];

  return (
    <>
      <div
        className="block bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
        onContextMenu={handleContextMenu}
        onClick={handleFileClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <Icon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{file.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">{file.type}</p>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete File"
        message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
      />

      <ConfirmationDialog
        isOpen={showRenameDialog}
        onClose={() => setShowRenameDialog(false)}
        onConfirm={handleRename}
        title="Rename File"
        confirmText="Rename"
        hideCancel={false}
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter new name"
          autoFocus
        />
      </ConfirmationDialog>

      {showCanvas && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex flex-col h-screen">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowCanvas(false);
                    onFileClose?.();
                  }}
                  className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PenSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {file.name}
                  </h1>
                  <p className="text-sm text-gray-600">Canvas</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Canvas />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
