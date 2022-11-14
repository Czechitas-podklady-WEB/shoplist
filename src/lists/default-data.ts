import { Day } from './week.js';
import { ProductItemData } from "./product-list.js";

export type DefaultWeek = {
  [D in Day]: ProductItemData[];
}

export const defaultWeek: DefaultWeek = {
  mon: [
    {
      product: 'Rohlíky',
      amount: 10,
      unit: 'ks',
      done: true,
    },
    {
      product: 'Máslo',
      amount: 500,
      unit: 'g',
      done: false,
    },
    {
      product: 'Šunka',
      amount: 2,
      unit: 'balení',
      done: false,
    },
    {
      product: 'Eidem',
      amount: 1,
      unit: 'balení',
      done: false,
    },
    {
      product: 'Rajčata',
      amount: 400,
      unit: 'g',
      done: true,
    },
    {
      product: 'Okurky',
      amount: 2,
      unit: 'ks',
      done: true,
    },
    {
      product: 'Cibule',
      amount: 6,
      unit: 'ks',
      done: true,
    },
  ],
  tue: [
    {
      product: 'Špagety',
      amount: 1,
      unit: 'balení',
      done: true,
    },
    {
      product: 'Mleté maso',
      amount: 500,
      unit: 'g',
      done: true,
    },
    {
      product: 'Pivo Kozel',
      amount: 6,
      unit: 'ks',
      done: true,
    },
  ],
  wed: [],
  thu: [
    {
      product: 'Sprchový gel',
      amount: 1,
      unit: 'ks',
      done: false,
    },
    {
      product: 'Zubní kartáček',
      amount: 3,
      unit: 'ks',
      done: false,
    },
    {
      product: 'Zubní pasta',
      amount: 2,
      unit: 'ks',
      done: false,
    },
    {
      product: 'Hřeben',
      amount: 2,
      unit: 'ks',
      done: false,
    },
    {
      product: 'Kosmetická taška',
      amount: 1,
      unit: 'ks',
      done: false,
    },
  ],
  fri: [
    {
      product: 'Čokoláda 80%',
      amount: 1,
      unit: 'ks',
      done: true,
    },
    {
      product: 'Minerální voda',
      amount: 1,
      unit: 'balení',
      done: true,
    },
    {
      product: 'Olivový olej',
      amount: 500,
      unit: 'ml',
      done: true,
    },
    {
      product: 'Jameson Whiskey',
      amount: 700,
      unit: 'ml',
      done: true,
    },
    {
      product: 'Brambůrky, solené',
      amount: 2,
      unit: 'balení',
      done: false,
    },
  ],
  sat: [
    {
      product: 'Dobíjací baterie AAA',
      amount: 6,
      unit: 'ks',
      done: false,
    },
    {
      product: 'LEGO Harry Potter',
      amount: 1,
      unit: 'ks',
      done: false,
    },
  ],
  sun: [],
};
