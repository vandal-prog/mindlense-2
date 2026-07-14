import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, LineChart, LogOut, Brain, Calendar, Clock, 
  TrendingUp, Users, Bell, Sparkles, Target, Shield, BookOpen,
  Sun, Wind, List, Star, Heart, Globe, Phone, X, CheckCircle,
  SmilePlus, HelpCircle, Lock, FileText, Info
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import AboutModal from '../components/AboutModal';

type Activity = {
  id: string;
  type: 'chat' | 'mood' | 'routine';
  title: string;
  timestamp: string;
  details?: string;
};

const MOOD_EMOJIS = [
  { emoji: "😊", label: "Happy", value: "happy", score: 9 },
  { emoji: "😌", label: "Content", value: "content", score: 7 },
  { emoji: "😐", label: "Neutral", value: "neutral", score: 5 },
  { emoji: "😕", label: "Worried", value: "worried", score: 4 },
  { emoji: "😢", label: "Sad", value: "sad", score: 3 },
  { emoji: "😫", label: "Overwhelmed", value: "overwhelmed", score: 2 }
];

const quickActions = [
  { 
    icon: <Brain className="h-5 w-5" />, 
    label: "Daily Check-in",
    link: "/mood",
    color: "text-indigo-600" 
  },
  { 
    icon: <Sparkles className="h-5 w-5" />, 
    label: "New Session",
    link: "/chat",
    color: "text-purple-600" 
  },
  { 
    icon: <Sun className="h-5 w-5" />, 
    label: "Morning Routine",
    link: "/morning",
    color: "text-orange-600" 
  },
  { 
    icon: <Shield className="h-5 w-5" />, 
    label: "Crisis Help",
    link: "/crisis",
    color: "text-red-600" 
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'chat':
      return <MessageSquare className="h-5 w-5 text-indigo-600" />;
    case 'mood':
      return <Heart className="h-5 w-5 text-green-600" />;
    case 'routine':
      return <Sun className="h-5 w-5 text-orange-600" />;
    default:
      return <BookOpen className="h-5 w-5 text-gray-600" />;
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffHours < 24) {
    return diffHours === 0 
      ? 'Just now'
      : `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  return date.toLocaleDateString();
};

export default function Dashboard() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageMood: 0,
    streak: 0,
    lastSession: null as string | null,
    riskLevel: 'low',
    completedRoutines: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [welcomeStep, setWelcomeStep] = useState(1);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const [
          { data: sessions },
          { data: messages },
          { data: moods },
          { data: weeklyMoods }
        ] = await Promise.all([
          supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('messages')
            .select('*')
            .eq('type', 'user')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('mood_checks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('mood_checks')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', startOfWeek.toISOString())
            .order('created_at', { ascending: false })
        ]);

        const avgMood = moods?.length 
          ? moods.reduce((acc, curr) => acc + curr.score, 0) / moods.length 
          : 0;

        const streak = calculateStreak(moods || []);
        const completedRoutines = weeklyMoods?.length || 0;

        setStats({
          totalSessions: sessions?.length || 0,
          averageMood: Math.round(avgMood * 10) / 10,
          streak,
          lastSession: sessions?.[0]?.created_at || null,
          riskLevel: 'low',
          completedRoutines
        });

        const activities: Activity[] = [];

        moods?.slice(0, 3).forEach(mood => {
          activities.push({
            id: mood.id,
            type: 'mood',
            title: 'Completed Mood Check',
            timestamp: mood.created_at,
            details: `Mood: ${mood.score}/10`
          });
        });

        messages?.slice(0, 3).forEach(message => {
          activities.push({
            id: message.id,
            type: 'chat',
            title: 'Chat Session',
            timestamp: message.created_at,
            details: 'AI Conversation'
          });
        });

        activities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const calculateStreak = (moods: any[]) => {
    if (!moods.length) return 0;
    let streak = 1;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastCheckIn = new Date(moods[0].created_at);
    if (lastCheckIn < yesterday) return 0;

    for (let i = 1; i < moods.length; i++) {
      const current = new Date(moods[i-1].created_at);
      const prev = new Date(moods[i].created_at);
      const diffDays = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) streak++;
      else break;
    }

    return streak;
  };

  const handleMoodSelection = async (mood: string) => {
    if (!user) return;

    try {
      setSelectedMood(mood);
      const selectedEmoji = MOOD_EMOJIS.find(e => e.value === mood);
      
      await supabase
        .from('users')
        .update({
          initial_mood: { 
            mood: mood,
            timestamp: new Date().toISOString(),
            score: selectedEmoji?.score 
          }
        })
        .eq('id', user.id);
      
      if (selectedEmoji && selectedEmoji.score <= 4) {
        setShowWelcome(false);
        navigate('/assessment');
      } else {
        setWelcomeStep(2);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const closeWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Soleful</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
              <button 
                onClick={() => setShowAboutModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                title="About Soleful"
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </button>
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={signOut}
                className="inline-flex items-center px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Sign out</span>
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex sm:hidden items-center space-x-2">
              <button 
                onClick={() => setShowAboutModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="About Soleful"
              >
                <Info className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 relative">
            <button
              onClick={closeWelcome}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            {welcomeStep === 1 ? (
              <>
                <div className="text-center mb-8">
                  <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to Your Safe Space
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You are valued, loved, and worthy of support. We're here to walk this journey with you.
                    How are you feeling right now?
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {MOOD_EMOJIS.map((emoji) => (
                    <button
                      key={emoji.value}
                      onClick={() => handleMoodSelection(emoji.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedMood === emoji.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">{emoji.emoji}</div>
                      <div className="text-sm font-medium text-gray-700">
                        {emoji.label}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Thank You for Sharing
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your well-being matters to us. Here's what you can do next:
                  </p>
                </div>
                <div className="space-y-4 mb-8">
                  <Link
                    to="/chat"
                    className="block w-full p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <MessageSquare className="h-6 w-6 text-indigo-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Start a Conversation</h3>
                        <p className="text-sm text-gray-600">Chat with our AI companion</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/mood"
                    className="block w-full p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <LineChart className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Track Your Journey</h3>
                        <p className="text-sm text-gray-600">Monitor your daily mood</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <button
                  onClick={closeWelcome}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
              </h2>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-green-600 font-medium text-sm sm:text-base">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {loading ? (
                    <span className="animate-pulse">Loading routines...</span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">{stats.completedRoutines}/7 weekly routines completed</span>
                      <span className="sm:hidden">{stats.completedRoutines}/7 routines</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {stats.riskLevel === 'high' && (
              <Link
                to="/crisis"
                className="px-3 sm:px-4 py-2 bg-red-50 text-red-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <span className="hidden sm:inline">Support Available 24/7</span>
                <span className="sm:hidden">Crisis Support</span>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
              >
                <span className={`${action.color} group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center sm:text-left">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium">Total Sessions</h3>
              <Users className="h-5 w-5 sm:h-6 sm:w-6 opacity-75" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{loading ? '...' : stats.totalSessions}</p>
            <p className="text-purple-100 text-xs sm:text-sm mt-2">
              {stats.lastSession 
                ? `Last: ${new Date(stats.lastSession).toLocaleDateString()}`
                : 'Start your journey today'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium">Average Mood</h3>
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 opacity-75" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{loading ? '...' : stats.averageMood}/10</p>
            <div className="flex items-center text-green-100 text-xs sm:text-sm mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                stats.averageMood >= 7 ? 'bg-green-300' :
                stats.averageMood >= 4 ? 'bg-yellow-300' :
                'bg-red-300'
              }`} />
              {stats.averageMood >= 7 ? 'Doing great!' :
               stats.averageMood >= 4 ? 'Room for improvement' :
               'Let\'s work on this together'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 text-white sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium">Current Streak</h3>
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 opacity-75" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {loading ? '...' : `${stats.streak} ${stats.streak === 1 ? 'day' : 'days'}`}
            </p>
            <p className="text-orange-100 text-xs sm:text-sm mt-2">
              {stats.streak > 0 
                ? 'Keep the momentum going!'
                : 'Start your streak today'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Recent Activity</h3>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity yet. Start your journey today!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                  {activity.details && (
                    <span className="text-sm text-gray-600">{activity.details}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            to="/chat"
            className="group bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-indigo-100"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-xl p-3 group-hover:bg-indigo-200 transition-colors">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Start a Chat Session
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Talk to our AI about your thoughts and feelings
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/mood"
            className="group bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-green-100"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-xl p-3 group-hover:bg-green-200 transition-colors">
                  <LineChart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Track Your Mood
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Log and monitor your daily emotional state
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4">
            {/* Main attribution */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-500">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">© 2025 Soleful. All rights reserved.</span>
              </div>
              <span className="hidden sm:inline text-sm text-gray-400">•</span>
              <span className="text-xs sm:text-sm">
                Created by{' '}
                <a 
                  href="https://joscode.surge.sh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                >
                  Joscode
                </a>
              </span>
            </div>
            
            {/* Links */}
            <div className="flex flex-wrap items-center justify-center space-x-4 sm:space-x-6">
              <Link
                to="/privacy"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Privacy Policy</span>
                <span className="sm:hidden">Privacy</span>
              </Link>
              <Link
                to="/terms"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Terms & Conditions</span>
                <span className="sm:hidden">Terms</span>
              </Link>
              <a
                href="mailto:support@soleful.com"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal 
        isOpen={showAboutModal} 
        onClose={() => setShowAboutModal(false)} 
      />
    </div>
  );
}