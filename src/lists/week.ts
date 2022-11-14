import { ProductList } from "./product-list.js";

export const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export type Day = typeof days[number];

export const isDay = (day: string): day is Day => days.find(
  (d) => d === day
) !== undefined;

export type Week = {
  [D in Day]: ProductList;
};

export const dayNames = {
  mon: 'Pondělí',
  tue: 'Úterý',
  wed: 'Středa',
  thu: 'Čtvrtek',
  fri: 'Pátek',
  sat: 'Sobota',
  sun: 'Neděle',
};
