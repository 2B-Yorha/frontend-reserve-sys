import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTutors } from '../../hooks/useTutors';

export function BrowseTutorsPage() {
  const [subject, setSubject] = useState('');
  const { data: tutors, isLoading, isError } = useTutors(subject || undefined);

  return (
    <div>
      <h1>Find a tutor</h1>
      <input
        placeholder="Filter by subject (e.g. Algebra)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {isLoading && <p>Loading tutors…</p>}
      {isError && <p role="alert">Couldn't load tutors. Try again.</p>}

      <div style={{ display: 'grid', gap: 12 }}>
        {tutors?.map((t) => (
          <Link
            key={t.id}
            to={`/tutors/${t.id}`}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, textDecoration: 'none', color: 'inherit' }}
          >
            <strong>{t.fullName}</strong>
            <p>{t.bio}</p>
            <p>${t.hourlyRate}/hr · {t.subjects.map((s) => s.name).join(', ')}</p>
          </Link>
        ))}
        {tutors?.length === 0 && <p>No tutors found for that subject.</p>}
      </div>
    </div>
  );
}