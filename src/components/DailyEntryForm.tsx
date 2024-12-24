import React, { useState } from 'react';
import { format } from 'date-fns';
import Modal from './common/Modal';
import FormField from './common/FormField';

interface DailyEntryFormProps {
  onSubmit: (data: { date: string; topics: string; participants: string }) => void;
  onClose: () => void;
}

export default function DailyEntryForm({ onSubmit, onClose }: DailyEntryFormProps) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    topics: '',
    participants: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal title="New Daily Entry" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormField label="Date">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="form-input"
            required
          />
        </FormField>
        
        <FormField label="Topics">
          <input
            type="text"
            value={formData.topics}
            onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
            className="form-input"
            placeholder="Enter topics discussed"
            required
          />
        </FormField>
        
        <FormField label="Participants">
          <input
            type="text"
            value={formData.participants}
            onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
            className="form-input"
            placeholder="John Doe, Jane Smith"
            required
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
          >
            Save Entry
          </button>
        </div>
      </form>
    </Modal>
  );
}