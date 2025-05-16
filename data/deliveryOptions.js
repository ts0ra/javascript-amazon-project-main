import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { isWeekend } from '../scripts/utils/day.js';

export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  { 
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach(option => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOption[0];
}

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let remainingDays = deliveryOption.deliveryDays;
  let deliveryDate = today;

  while (remainingDays) {
    deliveryDate = deliveryDate.add(1, 'days');
    if (isWeekend(deliveryDate)) {
      continue;
    } 
    remainingDays--;
  }

  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  );

  return dateString;
}