import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DailyEntryForm from './DailyEntryForm';

interface DailyEntry {
  id: string;
  date: string;
  topics: string;
  participants: string[];
  created_at: string;
}

export default function DailyEntries() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      setEntries(data || []);
    }
  }

  async function handleSubmit(formData: {
    date: string;
    topics: string;
    participants: string;
  }) {
    const { data, error } = await supabase.from('daily_entries').insert([
      {
        date: formData.date,
        topics: formData.topics,
        participants: formData.participants.split(',').map((p) => p.trim()),
      },
    ]);

    if (error) {
      console.error('Error creating entry:', error);
    } else {
      setShowForm(false);
      fetchEntries();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily Entries</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </button>
      </div>

      {showForm && (
        <DailyEntryForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <li key={entry.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{entry.topics}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.participants.map((participant, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
 
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}