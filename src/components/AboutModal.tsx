import React from 'react';
import { X, Brain, Heart, MessageSquare, LineChart, Shield, Sparkles, Target } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  console.log('AboutModal render - isOpen:', isOpen);
  
  if (!isOpen) return null;

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "AI-Powered Conversations",
      description: "Chat with our empathetic AI companion using Socratic dialogue to explore your thoughts and feelings safely."
    },
    {
      icon: <LineChart className="h-6 w-6 text-green-600" />,
      title: "Mood Tracking",
      description: "Monitor your daily emotional state with comprehensive assessments and track your mental wellness journey."
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      title: "Personalized Support",
      description: "Get tailored insights and recommendations based on your unique mental health patterns and goals."
    },
    {
      icon: <Shield className="h-6 w-6 text-red-600" />,
      title: "Crisis Resources",
      description: "Access immediate support with international crisis hotlines and coping strategies when you need them most."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-600" />,
      title: "Daily Inspiration",
      description: "Start each day with personalized motivation and mindfulness exercises to set a positive tone."
    },
    {
      icon: <Target className="h-6 w-6 text-orange-600" />,
      title: "Goal Setting",
      description: "Set and track your daily priorities and mental wellness goals with our intuitive planning tools."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg sm:rounded-xl">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">About Soleful</h2>
                <p className="text-sm sm:text-base text-gray-600">Your Personal Mental Wellness Companion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Introduction */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to Your Safe Space for Mental Wellness
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Soleful is a comprehensive mental health support platform designed to provide personalized, 
              accessible, and effective tools for your mental wellness journey. Whether you're looking to 
              track your mood, have meaningful conversations, or access crisis support, we're here to help 
              you navigate your mental health with compassion and understanding.
            </p>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              What Makes Soleful Special
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                        {feature.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              How Soleful Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Complete Assessment</h4>
                <p className="text-sm text-gray-600">
                  Start with a personalized questionnaire to understand your mental health needs and goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Daily Engagement</h4>
                <p className="text-sm text-gray-600">
                  Use our tools daily to track your mood, chat with AI, and build healthy mental habits.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
                <p className="text-sm text-gray-600">
                  Monitor your mental wellness journey with insights, patterns, and personalized recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Safety & Privacy */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Your Safety & Privacy Matter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-900 mb-2">🔒 Privacy First</h4>
                <p className="text-sm text-green-800">
                  Your data is encrypted and secure. We use industry-standard security practices to protect your information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">🛡️ Crisis Support</h4>
                <p className="text-sm text-green-800">
                  Immediate access to crisis resources and professional help when you need it most.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Ready to start your mental wellness journey?
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
