import express from 'express';
import { param, body } from 'express-validator';
import { addItem, deleteItem, findItem, MoveDirection, moveItem, ProductItemData, updateItem } from '../lists/product-list.js';
import { days, Day, isDay } from '../lists/week.js';
import { createDefaultList, createDefaultWeek, createEmptyList } from '../lists/weeks.js';
import { ApiResourceRef, resource } from '../nanorest.js';

interface WeekControllerOptions {
  useSampleWeek: boolean,
}

export const weekController = (options: WeekControllerOptions) => {
  const { useSampleWeek } = options;
  const router = express.Router();
  
  if (useSampleWeek) {
    const week = createDefaultWeek();
    router.use((req, res, next) => {
      req.week = week;
      next();
    });
  }
  
  router.get('/', resource('week', (req, res) => {
    const refs: ApiResourceRef[] = days.map(
      (day): ApiResourceRef => ({
        type: 'day',
        id: day,
        url: `${req.originalUrl}/${day}`,
      })
    );
  
    res.success(refs);
  }));

  const dayValidator = param('day').custom((value) => isDay(value));

  router.get('/:day',
    dayValidator,
    resource('day', (req, res) => {
      const { day } = req.params;  
      res.success(req.week![day as Day]);
    })
  );

  router.get('/:day/items',
    dayValidator, 
    resource('items', (req, res) => {
      const { day } = req.params;
      res.success(req.week![day as Day].items);
    })
  );

  router.get('/:day/items/:itemId',
    dayValidator,
    resource('item', (req, res) => {
      const { day, itemId } = req.params;
      const list = req.week![day as Day];
      const result = findItem(list, itemId);
      
      if (result.status === 'success') {
        res.success(result.value);
      } else {
        res.error(404, result.errors);
      }
    })
  );

  if (useSampleWeek) {
    return router;
  }

  router.patch(
    `/:day/items/:itemId`,
    dayValidator,
    body('product').optional().isString().notEmpty(),
    body('amount')
      .optional()
      .not()
      .isString()
      .isInt({ min: 1 })
      .withMessage('Amount must be a whole number greater then 0'),
    body('unit').optional().isString().notEmpty(),
    body('done').optional().isBoolean(),
    resource('item', (req, res) => {
      const itemData = req.body as Partial<ProductItemData>;
      const day = req.params.day as Day;
      const list = req.week![day];
      const result = updateItem(list, req.params.itemId, itemData);
  
      if (result.status === 'success') {
        res.success(result.value);
      } else {
        res.error(404, result.errors);
      }
    })
  );

  router.delete(
    `/:day/items/:itemId`, 
    dayValidator,
    resource('day', (req, res) => {
      const day = req.params.day as Day;
      const itemId = req.params.itemId;
      const list = req.week![day];

      const result = deleteItem(list, itemId);
  
      if (result.status === 'success') {
        res.success(result.value);
      } else {
        res.error(404, result.errors);
      }
    })
  );

  router.post(
    `/:day/items/:itemId/actions`,
    dayValidator,
    body('type').isIn(['moveUp', 'moveDown']),
    resource('day', (req, res) => {
      const day = req.params.day as Day;
      const itemId = req.params.itemId;
      const direction = req.body.type as MoveDirection;
      const list = req.week![day];

      const result = moveItem(list, itemId, direction);

      if (result.status === 'success') {
        res.success(result.value);
      } else {
        res.error(404, result.errors);
      }
    })
  );

  router.post(
    `/:day/items`, 
    dayValidator,
    body('product').isString().notEmpty(),
    body('amount')
      .not()
      .isString()
      .isInt({ min: 1 })
      .withMessage('Amount must be a whole number greater then 0'),
    body('unit').isString().notEmpty(),
    body('done').optional().isBoolean(),
    resource('day', (req, res) => {
      const itemData = req.body as ProductItemData;
      const { day } = req.params;
      
      const list = req.week![day as Day];
      const result = addItem(list, itemData);
  
      if (result.status === 'success') {
        res.success(result.value);
      } else {
        res.error(400, result.errors);
      }
    })
  );

  router.post(
    `/:day/actions`,
    dayValidator,
    body('type').isIn(['reset', 'clear']),
    resource('day', (req, res) => {
      const { type } = req.body;
      const day = req.params.day as Day;

      if (type === 'reset') {
        req.week![day] = createDefaultList(day);
      } else if (type === 'clear') {
        req.week![day] = createEmptyList(day);
      }

      return res.success(req.week![day]);
    })
  );

  return router;
};
