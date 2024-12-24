import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TaskFormProps {
  onSubmit: (data: {
    text: string;
    type: string;
    content?: string;
  }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    type: 'text',
    content: '',
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'type' && value !== 'image') {
      setPreviewUrl(null);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    if (formData.type !== 'image') return;

    const items = e.clipboardData.items;
    const imageItem = Array.from(items).find(item => item.type.startsWith('image'));

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        await handleImageUpload(file);
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `tasks/${fileName}`;

      const { data, error } = await supabase.storage
        .from('tasks')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tasks')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, content: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">New Task</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6" onPaste={handlePaste}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Task Description</label>
            <input
              type="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="form-input w-full rounded-md border-gray-300"
              placeholder="What would you like to ask?"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select w-full rounded-md border-gray-300"
            >
              <option value="text">Text</option>
              <option value="coding">Code</option>
              <option value="image">Image</option>
              <option value="link">Link</option>
            </select>
          </div>
          {formData.type === 'image' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {uploading ? 'Uploading...' : 'Click to upload or paste an image'}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </label>
              </div>
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          ) : formData.type !== 'text' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {formData.type === 'coding' ? 'Code' : 'Link URL'}
              </label>
              <input
                type={formData.type === 'link' ? 'url' : 'text'}
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-input w-full rounded-md border-gray-300"
                placeholder={
                  formData.type === 'coding'
                    ? 'Paste your code here'
                    : 'Enter link URL'
                }
              />
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;