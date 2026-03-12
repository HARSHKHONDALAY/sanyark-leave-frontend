export function buildCalendarGrid(year, monthIndexZeroBased) {
  const firstDay = new Date(year, monthIndexZeroBased, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, monthIndexZeroBased, 1 - firstWeekday);

  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    cells.push(date);
  }

  return cells;
}

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function monthTitle(year, monthIndexZeroBased) {
  return new Date(year, monthIndexZeroBased, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });
}

export function addMonth(year, monthIndexZeroBased, delta) {
  const next = new Date(year, monthIndexZeroBased + delta, 1);
  return {
    year: next.getFullYear(),
    monthIndex: next.getMonth()
  };
}