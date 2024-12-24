import React, { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  type: string;
  content?: string;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const [showFullImage, setShowFullImage] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'coding':
        return 'bg-blue-100 text-blue-800';
      case 'text':
        return 'bg-green-100 text-green-800';
      case 'image':
        return 'bg-purple-100 text-purple-800';
      case 'link':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    if (!task.content) return null;

    switch (task.type) {
      case 'image':
        return (
          <div className="mt-4">
            <img
              src={task.content}
              alt={task.text}
              className="max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowFullImage(true)}
            />
          </div>
        );
      case 'coding':
        return (
          <div className="mt-4">
            <pre className="p-4 bg-gray-50 rounded-lg overflow-x-auto">
              <code>{task.content}</code>
            </pre>
          </div>
        );
      case 'link':
        return (
          <div className="mt-4">
            <a
              href={task.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {task.content}
            </a>
          </div>
        );
      default:
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-700">{task.content}</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                  task.type
                )}`}
              >
                {task.type}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(task.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="mt-2 text-gray-900">{task.text}</p>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && task.type === 'image' && task.content && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto"
          onClick={() => setShowFullImage(false)}
        >
          <div className="min-h-screen px-4 py-6 flex items-center justify-center">
            <div 
              className="relative bg-white rounded-lg p-2 max-w-4xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="overflow-auto max-h-[80vh]">
                <img
                  src={task.content}
                  alt={task.text}
                  className="w-full h-auto object-contain rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;