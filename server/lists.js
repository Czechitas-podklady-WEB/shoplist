import { nanoid } from 'nanoid';

const createDefaultData = () => {
  const result = new Array(52).fill(null).map(_ => ({
    mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
  }));

  result[0].mon = [
    { id: nanoid(6), product: 'Rohlíky', amount: '10', done: false },
    { id: nanoid(6), product: 'Máslo', amount: '500 g', done: true },
    { id: nanoid(6), product: 'Šunka', amount: '200 g', done: true },
  ];

  return result;
};

let data = createDefaultData();

export const getWeek = (num) => {
  const week = data[num];
  const days = Object.fromEntries(
    Object.entries(week).map(([day, items]) => [
      day,
      {
        itemsCount: items.length,
      }
    ])
  );

  return {
    num: num,
    days,
  }
}

export const getDays = (num) => {
  const week = getWeek(num);
  return week.days;
}

export const getList = (num, day) => {
  return data[num][day];
}

export const getItem = (num, day, itemId) => {
  const list = getList(num, day);
  return list.find((item) => item.id === itemId);
}

export const addItem = (num, day, product, amount, done) => {
  const list = getList(num, day);
  
  const newItem = {
    id: nanoid(6),
    product,
    amount,
    done,
  };

  list.push(newItem);
  return list;
}

export const updateItem = (num, day, itemId, product, amount, done) => {
  const item = getItem(num, day, itemId);
  
  if (item === undefined) {
    return undefined;
  }

  if (product !== undefined) {
    item.product = product;
  }
  
  if (amount !== undefined) {
    item.amount = amount;
  }

  if (done !== undefined) {
    item.done = done;
  }
  
  return item;
}

export const deleteItem = (num, day, itemId) => {
  const list = getList(num, day);
  const index = list.findIndex((item) => item.id === itemId);
  
  if (index === -1) {
    return undefined;
  }

  list.splice(index, 1);
  
  return list;
}

// export const getAllLists = () => data.map((list) => ({
//   name: list.name,
//   itemsCount: list.items.length,
// }));

// export const resetToDefault = () => {
//   data = createDefaultData();
//   return data;
// };

// export const getList = (listName) => data.find((list) => list.name === listName) ?? null;

// export const getListItem = (listName, itemId) => {
//   const list = getList(listName);
//   if (list === null) {
//     return null;
//   }

//   return list.items.find((item) => item.id === itemId) ?? null;
// }

// export const createList = (name) => {
//   const list = getList(name);

//   if (list === null) {
//     const newList = { name, items: [] }
//     data.push(newList);
//     return newList;
//   }

//   return null;
// };

// export const deleteList = (name) => {
//   const listIndex = data.findIndex((list) => list.name === name);

//   if (listIndex === -1) {
//     return false;
//   }

//   data = [
//     ...data.slice(0, listIndex),
//     ...data.slice(listIndex + 1),
//   ];

//   return true;
// };

// export const deleteListItem = (list, itemId) => {
//   const itemIndex = list.items.findIndex((item) => item.id === itemId);

//   if (itemIndex === -1) {
//     return null;
//   }

//   list.items = [
//     ...list.items.slice(0, itemIndex),
//     ...list.items.slice(itemIndex + 1),
//   ];

//   return list;
// }

// export const toggleItemDone = (list, itemId) => {
//   const item = list.items.find((item) => item.id === itemId) ?? null;
//   if (item === null) {
//     return null;
//   }

//   item.done = !item.done;
//   return item;
// }
