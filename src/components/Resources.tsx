import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ResourceForm from './ResourceForm';
import ResourceCard from './ResourceCard';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  created_at: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
    } else {
      setResources(data || []);
    }
  }

  async function handleSubmit(formData: {
    title: string;
    description: string;
    type: string;
    url: string;
  }) {
    const { error } = await supabase.from('resources').insert([formData]);

    if (error) {
      console.error('Error creating resource:', error);
    } else {
      setShowForm(false);
      fetchResources();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('resources').delete().eq('id', id);

    if (error) {
      console.error('Error deleting resource:', error);
    } else {
      fetchResources();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Resource
        </button>
      </div>

      {showForm && (
        <ResourceForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}

      <div className="space-y-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onEdit={() => {}} // To be implemented
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}