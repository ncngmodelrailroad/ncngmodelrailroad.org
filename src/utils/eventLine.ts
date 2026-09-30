export type LineStop = { id: string; start: string; end: string };
export type StopState = 'past' | 'now' | 'next' | 'later';

export type LineView = {
  visible: string[];
  states: Record<string, StopState>;
  /** Marker position in station units: 0 is the first visible station. */
  progress: number;
  nextId?: string;
  daysToNext?: number;
};

const MAX_PAST = 3;
const MAX_AHEAD = 4;

const dayNumber = (day: string) => Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86_400_000;

/** Stops must be sorted by start day. Days are YYYY-MM-DD in Pacific time. */
export function computeLineView(stops: LineStop[], today: string): LineView {
  const states: Record<string, StopState> = {};
  let nextId: string | undefined;
  for (const stop of stops) {
    if (stop.end < today) states[stop.id] = 'past';
    else if (stop.start <= today) states[stop.id] = 'now';
    else if (!nextId) { states[stop.id] = 'next'; nextId = stop.id; }
    else states[stop.id] = 'later';
  }

  const past = stops.filter(s => states[s.id] === 'past').slice(-MAX_PAST);
  const ahead = stops.filter(s => states[s.id] !== 'past').slice(0, MAX_AHEAD);
  const visibleStops = [...past, ...ahead];
  const visible = visibleStops.map(s => s.id);

  const nowIndex = visibleStops.findIndex(s => states[s.id] === 'now');
  let progress: number;
  if (nowIndex >= 0) {
    progress = nowIndex;
  } else if (past.length === 0) {
    progress = -0.5;
  } else if (ahead.length === 0) {
    progress = visibleStops.length - 0.5;
  } else {
    const from = past[past.length - 1];
    const to = ahead[0];
    const span = Math.max(1, dayNumber(to.start) - dayNumber(from.end));
    const traveled = Math.min(1, Math.max(0, (dayNumber(today) - dayNumber(from.end)) / span));
    // Keep the marker visibly between the two stations rather than on top of either.
    progress = past.length - 1 + 0.25 + traveled * 0.5;
  }

  const next = stops.find(s => s.id === nextId);
  return {
    visible,
    states,
    progress,
    nextId,
    daysToNext: next ? dayNumber(next.start) - dayNumber(today) : undefined,
  };
}

export function formatCountdown(days: number): string {
  if (days <= 0) return 'today';
  if (days === 1) return 'tomorrow';
  return `in ${days} days`;
}
