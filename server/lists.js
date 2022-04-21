import { nanoid } from 'nanoid';

let lists = [
  {
    name: 'default',
    items: [
      { id: nanoid(6), product: 'Rohlíky', amount: '10', done: false },
      { id: nanoid(6), product: 'Máslo', amount: '1 ks', done: false },
    ]
  },
];

export const getAllLists = () => lists.map((list) => ({
  name: list.name,
  itemsCount: list.items.length,
}));

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
  list.items.push(newItem);
  
  return newItem;
}

export const deleteListItem = (list, itemId) => {
  const itemIndex = list.items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return false;
  }

  list.items = [
    ...list.items.slice(0, itemIndex),
    ...list.items.slice(itemIndex + 1),
  ];
  
  return true;
}

export const setItemDone = (list, itemId, done) => {
  const item = list.items.find((item) => item.id === itemId) ?? null;
  if (item === null) {
    return null;
  }

  item.done = done;
  
  return item;
}
