import { nanoid } from "nanoid";
import { MaybeFail, fail, success } from "./maybe-fail.js";

const ID_SIZE = 8;
const MAX_ITEMS = 64;

export interface ProductItemData {
  product: string,
  amount: number,
  unit: string,
  done: boolean,
}

export type ProductItem = {
  id: string,
} & ProductItemData;

export interface ProductList {
  dayName: string,
  items: ProductItem[],
};

export const findItemIndex = (list: ProductList, itemId: string): MaybeFail<number> => {
  const index = list.items.findIndex((item) => item.id === itemId);
  if (index === -1) {
    return fail(`No item with id '${itemId}'`);
  }

  return success(index);
}

export const findItem = (list: ProductList, itemId: string): MaybeFail<ProductItem> => {
  const item = list.items.find((item) => item.id === itemId);
  if (item === undefined) {
    return fail(`No item with id '${itemId}'`);
  }

  return success(item);
}

export const createItem = (itemData: ProductItemData): ProductItem => ({
  id: nanoid(ID_SIZE),
  ...itemData,
});

export const addItem = (
  list: ProductList, itemData: ProductItemData,
): MaybeFail<ProductList> => {
  if (list.items.length === MAX_ITEMS) {
    return fail(`Shopping list cannot have more then ${MAX_ITEMS} items`);
  }
  
  list.items.push(createItem(itemData));
  return success(list);
};

export const updateItem = (
  list: ProductList, itemId: string, values: Partial<ProductItemData>,
): MaybeFail<ProductItem> => {
  const result = findItemIndex(list, itemId);
  if (result.status === 'fail') {
    return result;
  }
  
  const index = result.value;
  const item = list.items[index];
  const newItem: ProductItem = {
    id: item.id,
    product: values.product ?? item.product,
    amount: values.amount ?? item.amount,
    unit: values.unit ?? item.unit,
    done: values.done ?? item.done,
  };

  list.items[index] = newItem;
  return success(newItem);
};

export const deleteItem = (
  list: ProductList, itemId: string,
): MaybeFail<ProductList> => {
  const result = findItemIndex(list, itemId);
  if (result.status === 'fail') {
    return result;
  }
  
  const index = result.value;
  list.items.splice(index, 1);
  return success(list);
};

export type MoveDirection = 'moveUp' | 'moveDown';

export const moveItem = (
  list: ProductList, itemId: string, direction: MoveDirection
): MaybeFail<ProductList> => {
  const result = findItemIndex(list, itemId);
  if (result.status === 'fail') {
    return result;
  }

  const index = result.value;
  if (direction === 'moveUp') {
    if (index === 0) {
      return success(list);
    }

    const swap = list.items[index - 1];
    list.items[index - 1] = list.items[index];
    list.items[index] = swap;

    return success(list);
  }

  if (index === (list.items.length - 1)) {
    return success(list);
  }

  const swap = list.items[index + 1];
  list.items[index + 1] = list.items[index];
  list.items[index] = swap;

  return success(list);
};
