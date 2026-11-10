import { useMemo, useState } from 'react';
import {
  DoorClosed,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Building2,
  Ban,
  Info,
} from 'lucide-react';
import {
  ROOMS,
  BOOKINGS,
  DAY_END,
  minutesToLabel,
  checkAvailability,
  type RoomId,
  type Verdict,
} from '@/availability';

function App() {
  const [selectedRoom, setSelectedRoom] = useState<RoomId>('A101');
  const [startTime, setStartTime] = useState<number>(700);
  const [endTime, setEndTime] = useState<number>(750);
  const [currentTime, setCurrentTime] = useState<number>(540);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const room = useMemo(
    () => ROOMS.find((r) => r.id === selectedRoom)!,
    [selectedRoom],
  );

  const roomBookings = useMemo(
    () =>
      BOOKINGS.filter((b) => b.room === selectedRoom).sort(
        (a, b) => a.start - b.start,
      ),
    [selectedRoom],
  );

  const handleCheck = () => {
    setVerdict(
      checkAvailability(room, BOOKINGS, startTime, endTime, currentTime),
    );
  };

  const handleReset = () => {
    setVerdict(null);
  };

  const roomHelper = (min: number) => {
    if (min < 0) return 0;
    if (min > DAY_END) return DAY_END;
    return min;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              Smart Campus Room Availability
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Check whether a room is free for your chosen time — no booking is
              saved.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left column: controls */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <DoorClosed className="h-4 w-4 text-emerald-600" />
              Check a room
            </h2>

            {/* Current time */}
            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Current time (for testing)
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {minutesToLabel(currentTime)}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={DAY_END}
                step={5}
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(Number(e.target.value));
                  setVerdict(null);
                }}
                className="w-full accent-emerald-600"
              />
              <p className="mt-1 text-xs text-slate-400">
                Drag to simulate a different time of day (0–1440 min).
              </p>
            </div>

            {/* Room selector */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select a room
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {ROOMS.map((r) => {
                  const active = r.id === selectedRoom;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRoom(r.id);
                        setVerdict(null);
                      }}
                      className={[
                        'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition',
                        active
                          ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {r.name}
                      </span>
                      {r.blocked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          <Ban className="h-3 w-3" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Open
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Start time (min)
                </label>
                <input
                  type="number"
                  min={0}
                  max={DAY_END}
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(roomHelper(Number(e.target.value)));
                    setVerdict(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {minutesToLabel(startTime)}
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  End time (min)
                </label>
                <input
                  type="number"
                  min={0}
                  max={DAY_END}
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(roomHelper(Number(e.target.value)));
                    setVerdict(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {minutesToLabel(endTime)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleCheck}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                Check availability
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </section>

          {/* Right column: result + bookings */}
          <section className="flex flex-col gap-6">
            {/* Verdict */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                <Info className="h-4 w-4 text-emerald-600" />
                Result
              </h2>

              {verdict === null ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center">
                  <CalendarClock className="mb-2 h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-400">
                    Pick a room and time, then press{" "}
                    <span className="font-medium text-slate-600">
                      Check availability
                    </span>
                    .
                  </p>
                </div>
              ) : verdict.available ? (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-base font-bold text-emerald-800">
                      Available
                    </p>
                    <p className="mt-0.5 text-sm text-emerald-700">
                      {verdict.reason}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {verdict.details.map((d, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-1.5 text-xs text-emerald-600"
                        >
                          <CheckCircle2 className="h-3 w-3 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                  <div>
                    <p className="text-base font-bold text-red-800">
                      Unavailable
                    </p>
                    <p className="mt-0.5 text-sm text-red-700">
                      {verdict.reason}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Existing bookings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                <CalendarClock className="h-4 w-4 text-emerald-600" />
                Existing bookings — {room.name}
              </h2>

              {room.blocked ? (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <Ban className="h-4 w-4 shrink-0" />
                  This room is blocked — no bookings can be made.
                </div>
              ) : roomBookings.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No existing bookings for this room.
                </p>
              ) : (
                <ul className="space-y-2">
                  {roomBookings.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {b.end - b.start} min
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Prototype only — availability check, no booking is saved or
          confirmed.
        </footer>
      </main>
    </div>
  );
}

export default App;
