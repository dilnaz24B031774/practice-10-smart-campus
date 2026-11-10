import { describe, it, expect } from 'vitest';
import {
  checkAvailability,
  ROOMS,
  BOOKINGS,
  DAY_END,
  MAX_DURATION,
  type Booking,
} from '@/availability';

const openRoom = ROOMS.find((r) => r.id === 'A101')!;
const blockedRoom = ROOMS.find((r) => r.id === 'B205')!;
const freshBookings = (): Booking[] => BOOKINGS.map((b) => ({ ...b }));

describe('checkAvailability — AC1–AC6 regression', () => {
  it('AC1: start in the past (start <= currentTime) is unavailable', () => {
    // start 500 is at/behind current 540, so not strictly after current time
    const v = checkAvailability(openRoom, freshBookings(), 500, 560, 540);
    expect(v.available).toBe(false);
  });

  it('AC1: reversed interval (start >= end) is unavailable', () => {
    const v = checkAvailability(openRoom, freshBookings(), 800, 700, 540);
    expect(v.available).toBe(false);
  });

  it('AC2: 121-minute duration exceeds the 120-minute maximum', () => {
    const v = checkAvailability(openRoom, freshBookings(), 700, 821, 540);
    expect(v.available).toBe(false);
  });

  it('AC3: blocked room is always unavailable', () => {
    const v = checkAvailability(blockedRoom, freshBookings(), 700, 760, 540);
    expect(v.available).toBe(false);
  });

  it('AC4: overlapping an existing booking is unavailable', () => {
    // A101 has 600–660; 650–700 overlaps it
    const v = checkAvailability(openRoom, freshBookings(), 650, 700, 540);
    expect(v.available).toBe(false);
  });

  it('AC4: touching endpoints only (end === b.start) is available', () => {
    // A101 has 600–660; 660–720 touches at the endpoint, not overlapping
    const v = checkAvailability(openRoom, freshBookings(), 660, 720, 540);
    expect(v.available).toBe(true);
  });

  it('AC5/AC6: valid interval on an open room with no overlap is available', () => {
    // A101 bookings: 600–660, 900–960; 700–750 is clear, within 120 min, after 540
    const v = checkAvailability(openRoom, freshBookings(), 700, 750, 540);
    expect(v.available).toBe(true);
  });

  it('does not mutate the bookings array passed in', () => {
    const bookings = freshBookings();
    const snapshot = bookings.map((b) => ({ ...b }));
    checkAvailability(openRoom, bookings, 700, 750, 540);
    expect(bookings).toEqual(snapshot);
    expect(bookings.map((b) => b.start)).toEqual(snapshot.map((b) => b.start));
  });

  it('constants are unchanged', () => {
    expect(DAY_END).toBe(1440);
    expect(MAX_DURATION).toBe(120);
  });
});
