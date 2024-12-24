import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DiscussionForm from './DiscussionForm';
import DiscussionCard from './DiscussionCard';

interface Answer {
  id: string;
  content: string;
  created_at: string;
}

interface Discussion {
  id: string;
  question: string;
  created_at: string;
  answers: Answer[];
}

export default function Discussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  async function fetchDiscussions() {
    const { data: discussionsData, error: discussionsError } = await supabase
      .from('discussions')
      .select('*')
      .order('created_at', { ascending: false });

    if (discussionsError) {
      console.error('Error fetching discussions:', discussionsError);
      return;
    }

    const discussionsWithAnswers = await Promise.all(
      (discussionsData || []).map(async (discussion) => {
        const { data: answers, error: answersError } = await supabase
          .from('answers')
          .select('*')
          .eq('discussion_id', discussion.id)
          .order('created_at', { ascending: true });

        if (answersError) {
          console.error('Error fetching answers:', answersError);
          return { ...discussion, answers: [] };
        }

        return { ...discussion, answers: answers || [] };
      })
    );

    setDiscussions(discussionsWithAnswers);
  }

  async function handleSubmit(formData: { question: string }) {
    const { error } = await supabase.from('discussions').insert([formData]);

    if (error) {
      console.error('Error creating discussion:', error);
    } else {
      setShowForm(false);
      fetchDiscussions();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('discussions').delete().eq('id', id);

    if (error) {
      console.error('Error deleting discussion:', error);
    } else {
      fetchDiscussions();
    }
  }

  async function handleAnswer(discussionId: string, data: { content: string }) {
    const { error } = await supabase
      .from('answers')
      .insert([{ discussion_id: discussionId, content: data.content }]);

    if (error) {
      console.error('Error creating answer:', error);
    } else {
      fetchDiscussions();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Discussion
        </button>
      </div>

      {showForm && (
        <DiscussionForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            discussion={discussion}
            onDelete={handleDelete}
            onAnswer={handleAnswer}
          />
        ))}
      </div>
    </div>
  );
}