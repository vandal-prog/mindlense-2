import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sun, Wind, List, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { generateDailyInspiration } from '../lib/openai';

export default function MorningRoutine() {
  const { user } = useAuthStore();
  const [inspiration, setInspiration] = useState('');
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [newPriority, setNewPriority] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInspiration = async () => {
      if (user) {
        const story = await generateDailyInspiration();
        setInspiration(story);
        setLoading(false);
      }
    };
    loadInspiration();
  }, [user]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathCount(0);
    const interval = setInterval(() => {
      setBreathCount(count => {
        if (count >= 10) {
          clearInterval(interval);
          setIsBreathing(false);
          return count;
        }
        return count + 1;
      });
    }, 7000); // 7 seconds per breath cycle
  };

  const addPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPriority.trim() && priorities.length < 5) {
      setPriorities([...priorities, newPriority.trim()]);
      setNewPriority('');
    }
  };

  const removePriority = (index: number) => {
    setPriorities(priorities.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            <Sun className="h-6 w-6 text-orange-500" />
            <span className="text-lg font-semibold text-gray-900">Morning Routine</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inspiration Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Daily Inspiration</h2>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed">{inspiration}</p>
            )}
          </div>

          {/* Breathing Exercise */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Wind className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Mindful Breathing</h2>
            </div>
            <div className="text-center">
              {isBreathing ? (
                <div className="space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <div 
                      className={`absolute inset-0 bg-blue-100 rounded-full 
                        ${breathCount % 2 === 0 ? 'animate-breathe-in' : 'animate-breathe-out'}`}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl text-blue-600">{breathCount + 1}/10</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {breathCount % 2 === 0 ? 'Breathe in...' : 'Breathe out...'}
                  </p>
                </div>
              ) : (
                <button
                  onClick={startBreathing}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Breathing Exercise
                </button>
              )}
            </div>
          </div>

          {/* Daily Priorities */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <List className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Set Your Priorities</h2>
            </div>
            
            <form onSubmit={addPriority} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  placeholder="Add a priority for today..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  disabled={priorities.length >= 5}
                />
                <button
                  type="submit"
                  disabled={!newPriority.trim() || priorities.length >= 5}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {priorities.map((priority, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                >
                  <span className="text-purple-900">{priority}</span>
                  <button
                    onClick={() => removePriority(index)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              {priorities.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Add up to 5 priorities for your day
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}