export function buildDuration(departureStart: Date, departureEnd: Date): string {
  if (!departureStart || !departureEnd) return "N/A";

  // Calculate difference in milliseconds
  const diffMs = new Date(departureEnd).getTime() - new Date(departureStart).getTime();

  // Convert to days
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Nights = days - 1
  const nights = diffDays > 0 ? diffDays - 1 : 0;

  if (nights === 0) {
    return `${diffDays} ngày`;
  }

  return `${diffDays} ngày ${nights} đêm`;
}