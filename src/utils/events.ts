const PACIFIC_TIME_ZONE = 'America/Los_Angeles';

const pacificDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: PACIFIC_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

type EventDates = {
  date: Date;
  endDate?: Date;
};

/** Today at the fairgrounds, as YYYY-MM-DD. */
export function pacificToday(now: Date = new Date()): string {
  return pacificDayFormatter.format(now);
}

/**
 * Event dates come out of the content collection as midnight UTC, which is the
 * afternoon of the previous day in Pacific time. Comparing calendar days keeps
 * an event listed as upcoming through the end of its final day.
 */
export function eventEndDay(event: EventDates): string {
  return (event.endDate ?? event.date).toISOString().split('T')[0];
}

export function isUpcomingEvent(event: EventDates, now: Date = new Date()): boolean {
  return eventEndDay(event) >= pacificToday(now);
}
