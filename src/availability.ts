export type RoomId = 'A101' | 'B205' | 'C310';

export interface Room {
  id: RoomId;
  name: string;
  blocked: boolean;
}

export interface Booking {
  room: RoomId;
  start: number;
  end: number;
}

export const ROOMS: Room[] = [
  { id: 'A101', name: 'Room A101', blocked: false },
  { id: 'B205', name: 'Room B205', blocked: true },
  { id: 'C310', name: 'Room C310', blocked: false },
];

export const BOOKINGS: Booking[] = [
  { room: 'A101', start: 600, end: 660 },
  { room: 'A101', start: 900, end: 960 },
  { room: 'B205', start: 480, end: 540 },
  { room: 'C310', start: 720, end: 780 },
];

export const DAY_END = 1440;
export const MAX_DURATION = 120;

export function minutesToLabel(min: number): string {
  const clamped = Math.max(0, Math.min(DAY_END, min));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export type Verdict =
  | { available: true; reason: string; details: string[] }
  | { available: false; reason: string };

export function checkAvailability(
  room: Room,
  bookings: Booking[],
  start: number,
  end: number,
  currentTime: number,
): Verdict {
  // AC1: 0 <= start < end <= 1440 AND start > currentTime
  if (start < 0 || end > DAY_END || start >= end) {
    return {
      available: false,
      reason: 'Invalid interval — must have 0 ≤ start < end ≤ 1440.',
    };
  }
  if (start <= currentTime) {
    return {
      available: false,
      reason: `Start is not after the current time — start (${minutesToLabel(start)}) must be later than ${minutesToLabel(currentTime)}.`,
    };
  }

  // AC2: reject bookings longer than 120 minutes
  if (end - start > MAX_DURATION) {
    return {
      available: false,
      reason: `Too long — the booking is ${end - start} min, which exceeds the 120-minute maximum.`,
    };
  }

  // AC3: reject when room is blocked
  if (room.blocked) {
    return {
      available: false,
      reason: 'Blocked room — this room is currently blocked and cannot be booked.',
    };
  }

  // AC4: reject overlapping intervals (touching endpoints allowed)
  const roomBookings = bookings.filter((b) => b.room === room.id);
  const overlap = roomBookings.find(
    (b) => start < b.end && b.start < end,
  );
  if (overlap) {
    return {
      available: false,
      reason: `Overlap — the interval overlaps an existing booking from ${minutesToLabel(overlap.start)} to ${minutesToLabel(overlap.end)}.`,
    };
  }

  // AC5: available
  return {
    available: true,
    reason: `${room.name} is free ${minutesToLabel(start)}–${minutesToLabel(end)} (${end - start} min).`,
    details: [
      'Start is after the current time',
      'Room is open (not blocked)',
      `Duration is ${end - start} min — within the 120-minute limit`,
      'No overlap with existing bookings',
    ],
  };
}
