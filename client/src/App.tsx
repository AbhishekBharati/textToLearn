import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { ModulePage } from './pages/ModulePage';
import { LessonPage } from './pages/LessonPage';
import { Layout } from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CourseProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Nested Routes inside Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<HomePage />} />
                <Route path="/courses/:courseId" element={<CoursePage />} />
                <Route path="/modules/:moduleId" element={<ModulePage />} />
                <Route path="/lessons/:lessonId" element={<LessonPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CourseProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
