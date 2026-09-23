import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { BrowseTutorsPage } from './pages/student/BrowseTutorsPage';
import { MyBookingsPage } from './pages/student/MyBookingsPage';
import { TutorDetailPage } from './pages/student/TutorDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/" element={<BrowseTutorsPage />} />
            <Route path="/tutors/:id" element={<TutorDetailPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}