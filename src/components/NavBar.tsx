import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Browse Tutors</Link>
      <Link to="/my-bookings">My Bookings</Link>
      <span style={{ marginLeft: 'auto' }}>{user?.fullName}</span>
      <button onClick={handleLogout}>Log out</button>
    </nav>
  );
}