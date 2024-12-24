import React from 'react';
import {  Link, FileText, Video } from 'lucide-react';
import { format } from 'date-fns';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  created_at: string;
}

interface ResourceCardProps {
  resource: Resource;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  const getIcon = () => {
    switch (resource.type) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <Link className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <span className="mr-1">{getIcon()}</span>
              {resource.type}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(resource.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              {resource.title}
            </a>
          </h3>
          {resource.description && (
            <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}