const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

// "2024-01-15" -> "15 January 2024". UTC keeps it independent of the server time zone.
export function formatProjectDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}
