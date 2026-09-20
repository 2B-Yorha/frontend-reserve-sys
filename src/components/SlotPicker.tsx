import { useMemo } from 'react';
import type { Slot } from '../types';

interface Props {
  slots: Slot[];
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
}

export function SlotPicker({ slots, selected, onSelect }: Props) {
  const byDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const list = map.get(s.date) ?? [];
      list.push(s);
      map.set(s.date, list);
    }
    return map;
  }, [slots]);

  if (slots.length === 0) {
    return <p>No available slots in this range.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[...byDate.entries()].map(([date, daySlots]) => (
        <div key={date}>
          <strong>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {daySlots.map((slot) => {
              const isSelected =
                selected?.date === slot.date && selected?.startTime === slot.startTime;
              return (
                <button
                  key={`${slot.date}-${slot.startTime}`}
                  onClick={() => onSelect(slot)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: isSelected ? '2px solid #333' : '1px solid #ccc',
                    background: isSelected ? '#eee' : '#fff',
                  }}
                >
                  {slot.startTime}–{slot.endTime}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}