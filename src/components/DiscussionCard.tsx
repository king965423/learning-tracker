import React from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import AnswerForm from './AnswerForm';

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

interface DiscussionCardProps {
  discussion: Discussion;
  onDelete: (id: string) => void;
  onAnswer: (discussionId: string, data: { content: string }) => void;
}

export default function DiscussionCard({ discussion, onDelete, onAnswer }: DiscussionCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              {format(new Date(discussion.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{discussion.question}</h3>
          
          <div className="mt-4 space-y-4">
            {discussion.answers?.map((answer) => (
              <div key={answer.id} className="pl-4 border-l-2 border-gray-200">
                <p className="text-gray-700">{answer.content}</p>
                <span className="text-sm text-gray-500">
                  {format(new Date(answer.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            ))}
          </div>

          <AnswerForm
            discussionId={discussion.id}
            onSubmit={(data) => onAnswer(discussion.id, data)}
          />
        </div>
        <button
          onClick={() => onDelete(discussion.id)}
          className="text-gray-400 hover:text-red-500 ml-4"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}