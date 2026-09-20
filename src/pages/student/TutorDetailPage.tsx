import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlotPicker } from '../../components/SlotPicker';
import { getApiErrorCode, getApiErrorMessage, useCreateBooking } from '../../hooks/useBookings';
import { useTutor, useTutorSlots } from '../../hooks/useTutors';
import type { Slot } from '../../types';

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tutorId = Number(id);

  const { data: tutor, isLoading: tutorLoading } = useTutor(tutorId);

  // Show a rolling 7-day window; a real calendar UI could let the
  // student page forward/back, but this satisfies the "week-view" ask.
  const { from, to } = useMemo(() => {
    const today = new Date();
    const weekOut = new Date(today);
    weekOut.setDate(today.getDate() + 7);
    return { from: isoDate(today), to: isoDate(weekOut) };
  }, []);

  const { data: slots, isLoading: slotsLoading, refetch } = useTutorSlots(tutorId, from, to);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createBooking = useCreateBooking();

  if (tutorLoading) return <p>Loading tutor…</p>;
  if (!tutor) return <p>Tutor not found.</p>;

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedSubjectId) return;
    setFeedback(null);

    const sessionStart = `${selectedSlot.date}T${selectedSlot.startTime}:00`;
    const sessionEnd = `${selectedSlot.date}T${selectedSlot.endTime}:00`;

    try {
      await createBooking.mutateAsync({
        tutorProfileId: tutor.id,
        subjectId: selectedSubjectId,
        sessionStart,
        sessionEnd,
      });
      setFeedback({ type: 'success', message: 'Booking confirmed!' });
      setSelectedSlot(null);
    } catch (err) {
      const code = getApiErrorCode(err);
      if (code === 'SLOT_UNAVAILABLE') {
        setFeedback({
          type: 'error',
          message: 'Someone just booked this slot — pick another one.',
        });
        setSelectedSlot(null);
        refetch();
      } else {
        setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Booking failed.') });
      }
    }
  };

  return (
    <div>
      <h1>{tutor.fullName}</h1>
      <p>{tutor.bio}</p>
      <p>${tutor.hourlyRate}/hr</p>

      <label>
        Subject
        <select
          value={selectedSubjectId ?? ''}
          onChange={(e) => setSelectedSubjectId(Number(e.target.value) || null)}
        >
          <option value="">Select a subject</option>
          {tutor.subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>

      <h2>Available times (next 7 days)</h2>
      {slotsLoading ? (
        <p>Loading availability…</p>
      ) : (
        <SlotPicker slots={slots ?? []} selected={selectedSlot} onSelect={setSelectedSlot} />
      )}

      {feedback && (
        <p role="alert" style={{ color: feedback.type === 'error' ? '#a33' : '#2a2' }}>
          {feedback.message}
        </p>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedSlot || !selectedSubjectId || createBooking.isPending}
      >
        {createBooking.isPending ? 'Booking…' : 'Confirm booking'}
      </button>
    </div>
  );
}