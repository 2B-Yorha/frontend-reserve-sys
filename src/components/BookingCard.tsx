import type { Booking } from '../types';

interface Props {
  booking: Booking;
  onCancel?: (id: number) => void;
  isCancelling?: boolean;
}

const HOURS_24_MS = 24 * 60 * 60 * 1000;

export function BookingCard({ booking, onCancel, isCancelling }: Props) {
  const start = new Date(booking.sessionStart);
  const now = new Date();
  const withinCancelWindow = start.getTime() - now.getTime() < HOURS_24_MS;
  const cancellable =
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
    !withinCancelWindow;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <div><strong>{booking.tutorName ?? `Tutor #${booking.tutorProfileId}`}</strong></div>
      <div>{booking.subjectName ?? `Subject #${booking.subjectId}`}</div>
      <div>
        {start.toLocaleString()} – {new Date(booking.sessionEnd).toLocaleTimeString()}
      </div>
      <div>Status: {booking.status}</div>

      {onCancel && (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
        <>
          <button
            onClick={() => onCancel(booking.id)}
            disabled={!cancellable || isCancelling}
            title={
              withinCancelWindow
                ? 'Cancellation is disabled within 24 hours of the session'
                : undefined
            }
          >
            {isCancelling ? 'Cancelling…' : 'Cancel'}
          </button>
          {withinCancelWindow && (
            <p style={{ fontSize: 12, color: '#a33' }}>
              Too close to the session start time to cancel (24h cutoff).
            </p>
          )}
        </>
      )}
    </div>
  );
}