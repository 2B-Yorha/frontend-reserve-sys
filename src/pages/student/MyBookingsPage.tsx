import { useMemo } from 'react';
import { BookingCard } from '../../components/BookingCard';
import { useCancelBooking, useMyBookings } from '../../hooks/useBookings';

export function MyBookingsPage() {
  const { data: bookings, isLoading, isError } = useMyBookings();
  const cancelBooking = useCancelBooking();

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const upcoming = (bookings ?? []).filter((b) => new Date(b.sessionStart).getTime() >= now);
    const past = (bookings ?? []).filter((b) => new Date(b.sessionStart).getTime() < now);
    return { upcoming, past };
  }, [bookings]);

  if (isLoading) return <p>Loading your bookings…</p>;
  if (isError) return <p role="alert">Couldn't load your bookings.</p>;

  return (
    <div>
      <h1>My bookings</h1>

      <h2>Upcoming</h2>
      {upcoming.length === 0 && <p>No upcoming sessions.</p>}
      {upcoming.map((b) => (
        <BookingCard
          key={b.id}
          booking={b}
          onCancel={(id) => cancelBooking.mutate(id)}
          isCancelling={cancelBooking.isPending && cancelBooking.variables === b.id}
        />
      ))}

      <h2>Past</h2>
      {past.length === 0 && <p>No past sessions yet.</p>}
      {past.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}