import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function isWeekend(date) {
  const dateString = date.format('dddd');
  return dateString === 'Saturday' || dateString === 'Sunday'
}