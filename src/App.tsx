import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { Home } from './pages/home';
import { Dashboard } from './pages/dashboard';
import { Chat } from './pages/chat/Chat';
import { Discussions } from './pages/chat/Discussions';
import { Matrices } from './pages/matrices/Matrices';
import { MatrixAnalyzer } from './pages/matrices/MatrixAnalyzer';
import { Analysis } from './pages/matrices/Analysis';
import { Analyses } from './pages/matrices/Analyses';
import { AnalysisDetail } from './pages/matrices/AnalysisDetail';
import { AdminPage } from './pages/admin/AdminPage';
import { ProtectedRoute } from './components/protected-route';
import { MainNav } from './components/layout/MainNav';

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainNav />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainNav />
              <Discussions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:fileId"
          element={
            <ProtectedRoute>
              <MainNav />
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matrices"
          element={
            <ProtectedRoute>
              <MainNav />
              <Matrices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matrices/:matrixId/analyze"
          element={
            <ProtectedRoute>
              <MainNav />
              <MatrixAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matrices/analyses"
          element={
            <ProtectedRoute>
              <MainNav />
              <Analyses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matrices/analyses/:analysisId"
          element={
            <ProtectedRoute>
              <MainNav />
              <AnalysisDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matrices/:matrixId/analyze/:fileId"
          element={
            <ProtectedRoute>
              <MainNav />
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainNav />
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}