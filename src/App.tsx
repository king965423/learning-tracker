import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calendar, BookOpen, HelpCircle, Library, MessageCircle } from 'lucide-react';
import DailyEntries from './components/DailyEntries';
import Tasks from './components/Tasks';
import Resources from './components/Resources';
import Discussions from './components/Discussions';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Daily Entries
                </Link>
                <Link
                  to="/tasks"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Tasks
                </Link>
                <Link
                  to="/resources"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  <Library className="w-5 h-5 mr-2" />
                  Resources
                </Link>
                <Link
                  to="/discussions"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Discussions
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DailyEntries />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/discussions" element={<Discussions />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;