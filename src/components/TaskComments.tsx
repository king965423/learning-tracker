import React, { useState, useEffect, useRef } from 'react';
import { Send, Link, File, Folder, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  content: string;
  type: 'text' | 'link' | 'file' | 'folder';
  file_url?: string;
  created_at: string;
}

interface TaskCommentsProps {
  taskId: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'text' | 'link' | 'file' | 'folder'>('text');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('task_comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data || []);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `task-files/${fileName}`;

      const { data, error } = await supabase.storage
        .from('task-files')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('task-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && commentType === 'text') return;

    try {
      let fileUrl = '';
      
      if (commentType === 'file' || commentType === 'folder') {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          const uploadedUrl = await handleFileUpload(file);
          if (!uploadedUrl) return;
          fileUrl = uploadedUrl;
        }
      }

      const { error } = await supabase.from('task_comments').insert([
        {
          task_id: taskId,
          content: newComment.trim(),
          type: commentType,
          file_url: fileUrl || null,
        },
      ]);

      if (error) throw error;

      setNewComment('');
      setCommentType('text');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    }
  };

  const renderCommentContent = (comment: Comment) => {
    switch (comment.type) {
      case 'link':
        return (
          <a
            href={comment.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <Link className="w-4 h-4 mr-2" />
            {comment.content}
          </a>
        );
      case 'file':
      case 'folder':
        return (
          <a
            href={comment.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            {comment.type === 'file' ? (
              <File className="w-4 h-4 mr-2" />
            ) : (
              <Folder className="w-4 h-4 mr-2" />
            )}
            {comment.content}
          </a>
        );
      default:
        return <p className="text-gray-700">{comment.content}</p>;
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
      
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">
                  {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {renderCommentContent(comment)}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <button
            type="button"
            onClick={() => setCommentType('text')}
            className={`p-2 rounded ${
              commentType === 'text' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCommentType('link')}
            className={`p-2 rounded ${
              commentType === 'link' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCommentType('file')}
            className={`p-2 rounded ${
              commentType === 'file' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <File className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCommentType('folder')}
            className={`p-2 rounded ${
              commentType === 'folder' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Folder className="w-4 h-4" />
          </button>
        </div>

        <div className="flex space-x-2">
          {(commentType === 'file' || commentType === 'folder') ? (
            <div className="flex-1">
              <label className="block w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  onChange={(e) => setNewComment(e.target.files?.[0]?.name || '')}
                  multiple={commentType === 'folder'}
                  webkitdirectory={commentType === 'folder' ? '' : undefined}
                  disabled={uploading}
                />
              </label>
            </div>
          ) : (
            <input
              type={commentType === 'link' ? 'url' : 'text'}
              placeholder={
                commentType === 'link'
                  ? 'Enter URL...'
                  : 'Add a comment...'
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )}
          <button
            type="submit"
            disabled={uploading || (!newComment.trim() && commentType === 'text')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskComments;
