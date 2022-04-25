import { nanoid } from 'nanoid';

const createDefaultData = () => [
  {
    name: 'default',
    items: [
      { id: nanoid(6), product: 'Rohlíky', amount: '10', done: false },
      { id: nanoid(6), product: 'Máslo', amount: '500 g', done: true },
      { id: nanoid(6), product: 'Šunka', amount: '200 g', done: true },
    ]
  },
];

let lists = createDefaultData();

export const getAllLists = () => lists.map((list) => ({
  name: list.name,
  itemsCount: list.items.length,
}));

export const resetToDefault = () => {
  lists = createDefaultData();
  return lists;
};

export const getList = (listName) => lists.find((list) => list.name === listName) ?? null;

export const getListItem = (listName, itemId) => {
  const list = getList(listName);
  if (list === null) {
    return null;
  }

  return list.items.find((item) => item.id === itemId) ?? null;
}

export const createList = (name) => {
  const list = getList(name);

  if (list === null) {
    const newList = { name, items: [] }
    lists.push(newList);
    return newList;
  }

  return null;
};

export const deleteList = (name) => {
  const listIndex = lists.findIndex((list) => list.name === name);

  if (listIndex === -1) {
    return false;
  }

  lists = [
    ...lists.slice(0, listIndex),
    ...lists.slice(listIndex + 1),
  ];
  
  return true;
};

export const addListItem = (list, product, amount, done) => {
  const newItem = {
    id: nanoid(6),
    product,
    amount,
    done,
  };
  list.items = [...list.items, newItem];
  
  return list;
}

export const deleteListItem = (list, itemId) => {
  const itemIndex = list.items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return null;
  }

  list.items = [
    ...list.items.slice(0, itemIndex),
    ...list.items.slice(itemIndex + 1),
  ];
  
  return list;
}

export const toggleItemDone = (list, itemId) => {
  const item = list.items.find((item) => item.id === itemId) ?? null;
  if (item === null) {
    return null;
  }

  item.done = !item.done;
  return item;
}
