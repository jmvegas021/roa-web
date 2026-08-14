const displayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatBlogDate(isoDate: string): string {
  return displayFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function blogDateMs(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getTime();
}

export function blogDateToUtcString(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}
