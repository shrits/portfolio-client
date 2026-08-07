import { useState, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PostsProvider } from './context/PostsContext';
import AppLayout from './components/layout/AppLayout';
import ProfileView from './components/profile/ProfileView';
import ContactModal from './components/contact/ContactModal';
import { Loader2 } from 'lucide-react';

// Code splitting: Lazy load admin components to minimize initial bundle size for portfolio visitors
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

function RouteLoadingFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--surface-primary)' }}
    >
      <Loader2
        size={32}
        className="animate-spin"
        style={{ color: 'var(--accent-primary)' }}
      />
    </div>
  );
}

function AppRoutes() {
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {/* Public profile route with top navbar layout */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={<Navigate to="/profile" replace />}
            />
            <Route
              path="/profile"
              element={<ProfileView onMessageClick={openContact} />}
            />
          </Route>

          {/* Admin routes (no public layout, code-split) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </Suspense>

      {/* Contact Modal — rendered globally */}
      <ContactModal isOpen={contactOpen} onClose={closeContact} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PostsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </PostsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
