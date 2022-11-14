import { Day, Week, dayNames } from "./week.js";
import { defaultWeek } from "./default-data.js";
import { createItem, ProductList } from "./product-list.js";

export const createDefaultList = (day: Day): ProductList => {
  return {
    dayName: dayNames[day],
    items: defaultWeek[day].map(
      (itemData) => createItem(itemData)
    ),
  };
};

export const createEmptyList = (day: Day): ProductList => {
  return {
    dayName: dayNames[day],
    items: [],
  };
};

export const createDefaultWeek = (): Week => ({
  mon: createDefaultList('mon'),
  tue: createDefaultList('tue'),
  wed: createDefaultList('wed'),
  thu: createDefaultList('thu'),
  fri: createDefaultList('fri'),
  sat: createDefaultList('sat'),
  sun: createDefaultList('sun'),
});
