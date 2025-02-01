import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';

export default function NewProjectButton() {
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { addProject } = useProjects();

  const handleCreate = () => {
    if (projectName.trim()) {
      addProject(projectName.trim());
      setProjectName('');
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button
          onClick={handleCreate}
          disabled={!projectName.trim()}
          className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsCreating(false)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
    >
      <Plus className="w-4 h-4 mr-2" />
      New Project
    </button>
  );
}