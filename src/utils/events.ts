export const PACIFIC_TIME_ZONE = 'America/Los_Angeles';

const pacificDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: PACIFIC_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

type EventDates = {
  date: Date;
  endDate?: Date;
  layoutStartDate?: Date | null;
  layoutEndDate?: Date | null;
};

export function getEventDisplayDates(event: EventDates) {
  return event.layoutStartDate
    ? { date: event.layoutStartDate, endDate: event.layoutEndDate ?? undefined, label: 'Layout open' }
    : { date: event.date, endDate: event.endDate, label: 'Fairgrounds event dates' };
}

/** Today at the fairgrounds, as YYYY-MM-DD. */
export function pacificToday(now: Date = new Date()): string {
  return pacificDayFormatter.format(now);
}

/**
 * Event dates come out of the content collection as midnight UTC, which is the
 * afternoon of the previous day in Pacific time. Comparing calendar days keeps
 * an opening listed through its final confirmed layout day, or the host event's
 * final day when layout dates have not been confirmed.
 */
export function eventEndDay(event: EventDates): string {
  const { date, endDate } = getEventDisplayDates(event);
  return (endDate ?? date).toISOString().split('T')[0];
}

export function isUpcomingEvent(event: EventDates, now: Date = new Date()): boolean {
  return eventEndDay(event) >= pacificToday(now);
}

export function formatEventDate(date: Date, endDate?: Date, style: 'full' | 'compact' = 'full'): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: style === 'full' ? 'long' : undefined,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  if (style === 'compact') {
    return new Intl.DateTimeFormat('en-US', options).formatRange(date, endDate ?? date);
  }
  const start = date.toLocaleDateString('en-US', options);
  if (endDate && endDate.getTime() !== date.getTime()) {
    return `${start} - ${endDate.toLocaleDateString('en-US', options)}`;
  }
  return start;
}
