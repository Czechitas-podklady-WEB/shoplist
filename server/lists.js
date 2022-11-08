import { nanoid } from 'nanoid';

const ID_SIZE = 8;

const defaultLists = {
  mon: [
    {
      product: 'Rohlíky',
      amount: 10,
      unit: '',
      done: true,
    },
    {
      product: 'Máslo',
      amount: 1,
      unit: 'ks',
      done: false,
    },
    {
      product: 'Mléko',
      amount: 1,
      unit: 'litr',
      done: true,
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
      unit: '',
      done: true,
    },
    {
      product: 'Brambůrky, solené',
      amount: 2,
      unit: 'balení',
      done: false,
    },
  ],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: [],
};

const createList = (defaultList) => defaultList.map((item) => ({
  id: nanoid(ID_SIZE),
  ...item,
}));

const createDefaultData = () => {
  const result = new Array(52).fill(null).map(
    _ => Object.fromEntries(
      Object.entries(defaultLists).map(
        ([day, list]) => [day, createList(list)]
      )
    )
  );
  
  return result;
};

let data = createDefaultData();

export const getWeeks = () => {
  return data.map((week, index) => ({
    url: `/api/weeks/${index}`
  }));
};

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

export const addItem = (num, day, product, amount, unit, done) => {
  const list = getList(num, day);
  
  const newItem = {
    id: nanoid(ID_SIZE),
    product,
    amount,
    unit,
    done,
  };

  list.push(newItem);
  return list;
}

export const updateItem = (num, day, itemId, product, amount, unit, done) => {
  const item = getItem(num, day, itemId);
  
  if (item === undefined) {
    return undefined;
  }

  if (product !== undefined) {
    item.product = product;
  }
  
  if (amount !== undefined) {
    item.amount = Number(amount);
  }

  if (unit !== undefined) {
    item.unit = unit;
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

export const moveItem = (num, day, itemId, direction) => {
  const list = getList(num, day);
  const index = list.findIndex((item) => item.id === itemId);
  
  if (index === -1) {
    return undefined;
  }

  if (direction === 'up') {
    if (index === 0) {
      return list;
    }

    const swap = list[index - 1];
    list[index - 1] = list[index];
    list[index] = swap;

    return list;
  }

  if (direction === 'down') {
    if (index === (list.length - 1)) {
      return list;
    }

    const swap = list[index + 1];
    list[index + 1] = list[index];
    list[index] = swap;

    return list;
  }
  
  return undefined;
}

export const resetList = (num, day) => {
  data[num][day] = createList(defaultLists[day]);
  return data[num][day];
}

export const clearList = (num, day) => {
  data[num][day] = [];
  return data[num][day];
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
