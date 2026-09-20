import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../hooks/useBookings';
import type { Role } from '../../types';

export function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    try {
      await register({ email, password, fullName, role });
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
      <h1>Register</h1>
      <label>
        Full name
        <input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </label>
      <label>
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        I am a…
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="STUDENT">Student</option>
          <option value="TUTOR">Tutor</option>
        </select>
      </label>
      {error && <p role="alert" style={{ color: '#a33' }}>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Register'}
      </button>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}