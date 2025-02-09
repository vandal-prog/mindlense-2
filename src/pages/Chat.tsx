import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Plus, Brain, Sparkles, Target, AlertTriangle, 
  Copy, Check, Globe, Phone, MessageSquare, Heart, Clock, Archive 
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

// Crisis resources by country
const CRISIS_RESOURCES = {
  'United States': {
    emergency: '911',
    suicide_prevention: '988',
    crisis_text: 'Text HOME to 741741',
    resources: [
      { name: 'National Suicide Prevention Lifeline', number: '1-800-273-8255' },
      { name: 'SAMHSA Treatment Referral Hotline', number: '1-800-662-4357' },
      { name: 'Veterans Crisis Line', number: '1-800-273-8255 (Press 1)' }
    ]
  },
  'United Kingdom': {
    emergency: '999',
    suicide_prevention: '116 123 (Samaritans)',
    crisis_text: 'Text SHOUT to 85258',
    resources: [
      { name: 'Samaritans', number: '116 123' },
      { name: 'CALM (Campaign Against Living Miserably)', number: '0800 58 58 58' },
      { name: 'Mind', number: '0300 123 3393' }
    ]
  },
  'Canada': {
    emergency: '911',
    suicide_prevention: '1-833-456-4566',
    crisis_text: 'Text CONNECT to 686868',
    resources: [
      { name: 'Canada Suicide Prevention Service', number: '1-833-456-4566' },
      { name: 'Kids Help Phone', number: '1-800-668-6868' },
      { name: 'Crisis Services Canada', number: '1-833-456-4566' }
    ]
  },
  'Australia': {
    emergency: '000',
    suicide_prevention: '13 11 14',
    crisis_text: 'Text 0477 13 11 14',
    resources: [
      { name: 'Lifeline', number: '13 11 14' },
      { name: 'Beyond Blue', number: '1300 22 4636' },
      { name: 'Kids Helpline', number: '1800 55 1800' }
    ]
  }
} as const;

type CountryKey = keyof typeof CRISIS_RESOURCES;

const COPING_STRATEGIES = [
  {
    icon: <Heart className="h-5 w-5" />,
    title: 'Deep Breathing',
    description: 'Take slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.'
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.'
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Reach Out',
    description: 'Contact a trusted friend, family member, or professional.'
  }
];

function CrisisHelp() {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>('United States');
  const [showStrategies, setShowStrategies] = useState(false);

  const resources = CRISIS_RESOURCES[selectedCountry];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="h-5 w-5 text-orange-600" />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value as CountryKey)}
          className="flex-1 rounded-lg border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500"
        >
          {Object.keys(CRISIS_RESOURCES).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="bg-orange-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-orange-900 font-medium mb-2">
            <Phone className="h-5 w-5" />
            <span>Emergency: {resources.emergency}</span>
          </div>
          <p className="text-sm text-orange-800">
            For immediate life-threatening emergencies
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-3">Crisis Resources</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-orange-800">Suicide Prevention:</span>
              <span className="font-medium">{resources.suicide_prevention}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-orange-800">Crisis Text:</span>
              <span className="font-medium">{resources.crisis_text}</span>
            </li>
            {resources.resources.map((resource, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-orange-800">{resource.name}:</span>
                <span className="font-medium">{resource.number}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setShowStrategies(!showStrategies)}
          className="w-full text-left px-4 py-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-orange-900">
              Coping Strategies
            </span>
            <span className="text-orange-600">
              {showStrategies ? '−' : '+'}
            </span>
          </div>
        </button>

        {showStrategies && (
          <div className="space-y-3 p-4 bg-orange-50 rounded-lg">
            {COPING_STRATEGIES.map((strategy, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-orange-600 mt-1">
                  {strategy.icon}
                </div>
                <div>
                  <h5 className="font-medium text-orange-900">
                    {strategy.title}
                  </h5>
                  <p className="text-sm text-orange-700">
                    {strategy.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationList({ onSelect }: { onSelect: (id: string) => void }) {
  const { activeConversations } = useChatStore();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return hours === 0 ? 'Just now' : `${hours}h ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-2">
      {activeConversations.map(conv => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className="w-full p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors text-left group"
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="font-medium text-gray-900">Conversation</span>
            </div>
            <div className="flex items-center">
              {conv.unreadCount > 0 && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full mr-2">
                  {conv.unreadCount}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatDate(conv.timestamp)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {conv.lastMessage}
          </p>
        </button>
      ))}
    </div>
  );
}

export default function Chat() {
  const { user } = useAuthStore();
  const {
    messages,
    loading,
    error,
    insights,
    sessionId,
    sendMessage,
    startNewSession,
    generateInsights,
    loadChatHistory,
    markMessagesAsRead,
    loadActiveConversations
  } = useChatStore();
  
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastViewedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadActiveConversations(user.id);
      if (!sessionId) {
        startNewSession(user.id);
      }
      generateInsights(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (sessionId) {
      markMessagesAsRead(sessionId);
    }
  }, [sessionId, messages]);

  useEffect(() => {
    if (lastViewedRef.current) {
      lastViewedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading || !user) return;

    const content = message;
    setMessage('');
    await sendMessage(content, user.id);
  };

  const handleNewSession = async () => {
    if (!user) return;
    await startNewSession(user.id);
    setShowConversations(false);
  };

  const handleSelectConversation = async (id: string) => {
    await loadChatHistory(id);
    setShowConversations(false);
  };

  const copyInsights = async () => {
    if (!insights) return;
    try {
      await navigator.clipboard.writeText(insights);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy insights:', err);
    }
  };

  const formatInsights = (text: string) => {
    const sections = text.split('\n\n');
    return sections.map((section, index) => {
      if (!section.trim()) return null;

      const lines = section.split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1);

      const formattedContent = content.map((line, i) => {
        const bulletPoint = line.match(/^[•*-]\s+(.+)/);
        const numberedItem = line.match(/^\d+\.\s+(.+)/);
        
        if (bulletPoint || line.startsWith('•')) {
          return (
            <li key={i} className="ml-4 text-gray-600 mb-2">
              {line.replace(/^[•*-]\s+/, '')}
            </li>
          );
        } else if (numberedItem) {
          return (
            <li key={i} className="ml-4 text-gray-600 mb-2">
              {line.replace(/^\d+\.\s+/, '')}
            </li>
          );
        } else if (line.trim()) {
          return <p key={i} className="text-gray-600 mb-2">{line}</p>;
        }
        return null;
      });

      return (
        <div key={index} className="mb-6 last:mb-0">
          <h4 className="text-base font-semibold text-gray-900 mb-3">
            {title}
          </h4>
          <div className="space-y-1">
            {formattedContent}
          </div>
        </div>
      );
    });
  };

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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowConversations(!showConversations)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <Archive className="h-4 w-4 mr-2" />
              Conversations
            </button>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Insights
            </button>
            <button
              onClick={handleNewSession}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
            {showConversations ? (
              <div className="p-4 flex-1 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Conversations
                </h3>
                <ConversationList onSelect={handleSelectConversation} />
              </div>
            ) : (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                      <Brain className="h-12 w-12 text-indigo-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Welcome to MindLense Chat
                      </h3>
                      <p className="max-w-sm text-gray-600">
                        Share your thoughts and feelings in a safe, supportive space.
                        Your AI companion is here to listen and help.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        ref={i === messages.length - 1 ? messagesEndRef : undefined}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.type === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !message.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>

        {showInsights && (
          <div className="w-full md:w-80 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
                </div>
                <button
                  onClick={copyInsights}
                  className={`p-2 rounded-lg transition-colors ${
                    copied 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  disabled={!insights}
                  title="Copy insights"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="prose prose-sm">
                {insights ? (
                  <div className="space-y-4 divide-y divide-gray-100">
                    {formatInsights(insights)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Complete more check-ins to receive personalized insights.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-900">
                  Need Help?
                </h3>
              </div>
              <CrisisHelp />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}