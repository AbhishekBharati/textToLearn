import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ModulePage } from './pages/ModulePage';
import { LessonPage } from './pages/LessonPage';
import { Layout } from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId="778059473740-hqf08s7g1s8qqoia0mfk6pm55donnpkj.apps.googleusercontent.com">
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
