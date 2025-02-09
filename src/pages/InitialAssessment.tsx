import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Sparkles, Shield, Target, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type Question = {
  id: string;
  text: string;
  type: 'scale' | 'text' | 'choice';
  description?: string;
  choices?: string[];
  category: string;
};

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'current_mood',
    text: "How would you rate your overall mood right now?",
    type: "scale",
    description: "Consider your current emotional state and energy levels",
    category: "mood"
  },
  {
    id: 'stress_level',
    text: "How stressed or anxious are you feeling?",
    type: "scale",
    description: "Rate your current stress and anxiety levels",
    category: "mood"
  },
  {
    id: 'main_goal',
    text: "What's your primary goal for using MindLense?",
    type: "choice",
    choices: [
      "Manage anxiety and stress",
      "Improve emotional awareness",
      "Build better habits",
      "Track mood patterns",
      "Get daily support",
      "Personal growth"
    ],
    category: "goals"
  },
  {
    id: 'challenges',
    text: "What challenges are you currently facing?",
    type: "choice",
    choices: [
      "Work/Study stress",
      "Relationship issues",
      "Health concerns",
      "Financial stress",
      "Family matters",
      "Personal growth",
      "Other"
    ],
    category: "challenges"
  },
  {
    id: 'support_system',
    text: "How would you rate your current support system?",
    type: "scale",
    description: "Consider friends, family, and professionals who support your mental well-being",
    category: "support"
  },
  {
    id: 'coping_strategies',
    text: "What activities help you feel better when you're down?",
    type: "text",
    description: "Share any activities, hobbies, or practices that help improve your mood",
    category: "coping"
  },
  {
    id: 'sleep_quality',
    text: "How would you rate your sleep quality?",
    type: "scale",
    description: "Consider your sleep duration and quality over the past week",
    category: "health"
  }
];

const BENEFITS = [
  {
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    title: "Personalized Support",
    description: "Get tailored insights and guidance based on your unique needs"
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-500" />,
    title: "Safe Space",
    description: "A private, judgment-free environment for your mental wellness journey"
  },
  {
    icon: <Target className="h-6 w-6 text-green-500" />,
    title: "Goal Tracking",
    description: "Monitor your progress and celebrate your mental health achievements"
  },
  {
    icon: <Heart className="h-6 w-6 text-red-500" />,
    title: "Daily Support",
    description: "Access to tools and resources whenever you need them"
  }
];

export default function InitialAssessment() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [isDownMood, setIsDownMood] = useState(false);

  const handleAnswer = (answer: string | number) => {
    if (ASSESSMENT_QUESTIONS[currentQuestion].category === 'mood') {
      setIsDownMood(typeof answer === 'number' && answer < 5);
    }
    
    setAnswers(prev => ({
      ...prev,
      [ASSESSMENT_QUESTIONS[currentQuestion].id]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestion === ASSESSMENT_QUESTIONS.length - 1) {
      setLoading(true);
      try {
        if (!user) return;

        await supabase
          .from('users')
          .update({
            initial_assessment: answers,
            onboarding_completed: true
          })
          .eq('id', user.id);
        
        // Route to chat if mood is low, otherwise to dashboard
        navigate(isDownMood ? '/chat' : '/dashboard');
      } catch (error) {
        console.error('Error saving assessment:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-md mb-4">
            <Brain className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to MindLense</h1>
          <p className="text-xl text-gray-600">
            Let's personalize your mental wellness journey
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</span>
              <span>{Math.round(((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {currentQ.text}
          </h2>
          {currentQ.description && (
            <p className="text-gray-600 mb-6">{currentQ.description}</p>
          )}

          <div className="mt-6">
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
                  <span>Not at all</span>
                  <span>Very much</span>
                </div>
                <div className="text-center text-2xl font-semibold text-indigo-600">
                  {answers[currentQ.id] || 5}
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

          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={loading || !answers[currentQ.id]}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                'Saving...'
              ) : currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? (
                'Complete Assessment'
              ) : (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}