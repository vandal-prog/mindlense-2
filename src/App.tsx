import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Brain } from 'lucide-react';

const Auth = React.lazy(() => import('./pages/Auth'));
const InitialAssessment = React.lazy(() => import('./pages/InitialAssessment'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Chat = React.lazy(() => import('./pages/Chat'));
const MoodTracker = React.lazy(() => import('./pages/MoodTracker'));
const MorningRoutine = React.lazy(() => import('./pages/MorningRoutine'));
const Crisis = React.lazy(() => import('./pages/Crisis'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));

function App() {
  const { user, loading } = useAuthStore();

  useEffect(() => {
    void useAuthStore.getState().initialize();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Soleful...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Brain className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
          />
          <Route
            path="/assessment"
            element={user ? <InitialAssessment /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/mood"
            element={user ? <InitialAssessment /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/morning"
            element={user ? <MorningRoutine /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/crisis"
            element={user ? <Crisis /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/privacy"
            element={user ? <Privacy /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/terms"
            element={user ? <Terms /> : <Navigate to="/auth" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;