import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Leaderboard } from './pages/Leaderboard';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Redirect old admin route to unified dashboard */}
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
