import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Heart, Target, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type AssessmentQuestion = {
  id: string;
  text: string;
  type: 'scale' | 'text' | 'choice';
  choices?: string[];
  description?: string;
};

const DAILY_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 'mood',
    text: 'How would you rate your overall mood right now?',
    type: 'scale',
    description: 'Consider your current emotional state and energy levels'
  },
  {
    id: 'anxiety',
    text: 'How anxious or stressed do you feel?',
    type: 'scale',
    description: 'Rate your current stress and anxiety levels'
  },
  {
    id: 'sleep',
    text: 'How well did you sleep last night?',
    type: 'scale',
    description: 'Consider the quality and duration of your sleep'
  },
  {
    id: 'focus',
    text: 'How would you rate your ability to focus today?',
    type: 'scale',
    description: 'Think about your concentration and mental clarity'
  },
  {
    id: 'challenges',
    text: 'What challenges are you facing today?',
    type: 'choice',
    choices: [
      'Work/Study stress',
      'Relationship issues',
      'Health concerns',
      'Financial stress',
      'Family matters',
      'Personal growth',
      'Other/None'
    ]
  },
  {
    id: 'goals',
    text: 'What would you like to focus on today?',
    type: 'choice',
    choices: [
      'Stress management',
      'Emotional awareness',
      'Personal development',
      'Problem solving',
      'Relationship building',
      'Self-care',
      'Other'
    ]
  },
  {
    id: 'notes',
    text: 'Any additional thoughts or feelings you would like to share?',
    type: 'text',
    description: 'This helps personalize your chat sessions'
  }
];

export default function MoodTracker() {
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [DAILY_ASSESSMENT[currentQuestion].id]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestion === DAILY_ASSESSMENT.length - 1) {
      await submitAssessment();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  };

  const submitAssessment = async () => {
    if (loading || !user) return;

    setLoading(true);
    try {
      await supabase.from('mood_checks').insert({
        user_id: user.id,
        score: answers.mood,
        assessment_data: answers,
        notes: answers.notes || null
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Reset for next check-in
        setAnswers({});
        setCurrentQuestion(0);
      }, 2000);
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = DAILY_ASSESSMENT[currentQuestion];
  const progress = ((currentQuestion + 1) / DAILY_ASSESSMENT.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
            <Brain className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">Daily Check-in</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestion + 1} of {DAILY_ASSESSMENT.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Icons indicating assessment areas */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className={`flex flex-col items-center ${currentQuestion >= 0 && currentQuestion < 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <Heart className="h-6 w-6 mb-1" />
              <span className="text-xs">Emotional</span>
            </div>
            <div className={`flex flex-col items-center ${currentQuestion >= 2 && currentQuestion < 4 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <Target className="h-6 w-6 mb-1" />
              <span className="text-xs">Focus</span>
            </div>
            <div className={`flex flex-col items-center ${currentQuestion >= 4 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <Shield className="h-6 w-6 mb-1" />
              <span className="text-xs">Goals</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {currentQ.text}
            </h2>
            {currentQ.description && (
              <p className="text-gray-600 text-sm">{currentQ.description}</p>
            )}
          </div>

          {/* Answer Input */}
          <div className="mb-8">
            {currentQ.type === 'scale' ? (
              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={answers[currentQ.id] || 5}
                  onChange={(e) => handleAnswer(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-semibold text-indigo-600">
                    {answers[currentQ.id] || 5}
                  </span>
                  <span className="text-gray-600">/10</span>
                </div>
              </div>
            ) : currentQ.type === 'choice' ? (
              <div className="space-y-3">
                {currentQ.choices?.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(choice)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      answers[currentQ.id] === choice
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                rows={4}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Share your thoughts..."
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between space-x-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={loading || !answers[currentQ.id]}
              className="flex-1 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Saving...' : currentQuestion === DAILY_ASSESSMENT.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>

          {success && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg text-center">
              Daily check-in completed successfully!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}