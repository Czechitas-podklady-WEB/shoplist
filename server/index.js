import express from 'express';
import cors from 'cors';
import { param, body, validationResult } from 'express-validator';
import { sendResource, sendError } from './nanorest.js';
import {
  getWeeks,
  getWeek,
  getDays,
  getList,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  resetList,
  clearList,
  moveItem,
} from './lists.js';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();

server.use(`${baseUrl}/docs`, express.static('docs/_site', {
  extensions: ['html'],
}));

server.use(express.json());
server.use(cors());

server.get(`${baseUrl}/api/weeks`, (req, res) => {
  sendResource(req, res, getWeeks());
});

server.get(
  `${baseUrl}/api/weeks/:weekNumber`,
  param('weekNumber').isInt({ min: 0, max: 51}),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { weekNumber } = req.params;
    const week = getWeek(Number(weekNumber));
    sendResource(req, res, week);
  }
);

server.get(
  `${baseUrl}/api/weeks/:weekNumber`,
  param('weekNumber').isInt({ min: 0, max: 51}),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { weekNumber } = req.params;
    const week = getWeek(Number(weekNumber));
    sendResource(req, res, week);
  }
);

server.get(
  `${baseUrl}/api/weeks/:weekNumber/days`, 
  param('weekNumber').isInt({ min: 0, max: 51}),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { weekNumber } = req.params;
    const days = getDays(weekNumber);
    sendResource(req, res, days);
  }
);

server.get(
  `${baseUrl}/api/weeks/:weekNumber/days/:day`, 
  param('weekNumber').isInt({ min: 0, max: 51}),
  param('day').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { weekNumber, day } = req.params;
    sendResource(req, res, getList(weekNumber, day));
  }
);

server.get(
  `${baseUrl}/api/weeks/:weekNumber/days/:day/:itemId`, 
  param('weekNumber').isInt({ min: 0, max: 51}),
  param('day').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { weekNumber, day, itemId } = req.params;
    
    const product = getItem(weekNumber, day, itemId);

    if (product === undefined) {
      sendError(req, res, 404, ['No product with this id']);
      return;
    }
    
    sendResource(req, res, product);
  }
);

server.post(
  `${baseUrl}/api/weeks/:weekNumber/days/:day`, 
  param('weekNumber').isInt({ min: 0, max: 51}),
  param('day').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  body('amount').isInt({ min: 0 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { product, amount, unit, done = false } = req.body;
    const msgs = [];
    if (product === undefined) {
      msgs.push("The field 'product' is required");
    }

    if (typeof product !== 'string') {
      msgs.push("The field 'product' must be a string");
    }

    if (typeof unit !== 'string') {
      msgs.push("The field 'unit' must be a string");
    }

    if (typeof done !== 'boolean') {
      msgs.push("The field 'done' must be a boolean");
    }

    if (msgs.length > 0) {
      return sendError(req, res, 400, msgs);
    }

    const { weekNumber, day } = req.params;
    const newList = addItem(weekNumber, day, product, Number(amount), unit, done);

    sendResource(req, res, newList);
  }
);

server.post(
  `${baseUrl}/api/weeks/:weekNumber/days/:day/actions`, 
  param('weekNumber').isInt({ min: 0, max: 51}),
  param('day').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  body('type').isIn(['reset', 'clear']),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { weekNumber, day } = req.params;
    const { type } = req.body;
    
    if (type === 'reset') {
      const newList = resetList(weekNumber, day);
      return sendResource(req, res, newList);
    }

    if (type === 'clear') {
      const newList = clearList(weekNumber, day);
      return sendResource(req, res, newList);
    }
  }
);

server.patch(
  `${baseUrl}/api/weeks/:weekNumber/days/:day/:itemId`, 
  param('weekNumber').isInt({ min: 0, max: 51}),
  param('day').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { product, amount, unit, done } = req.body;
    
    const msgs = [];
    if (amount !== undefined) {
      if (
        typeof amount !== 'number' ||
        !Number.isInteger(amount) ||
        amount < 0
      ) {
        msgs.push("The field 'amount' must be a positive integer");
      }
    }
    
    if (product !== undefined && typeof product !== 'string') {
      msgs.push("The field 'product' must be a string");
    }

    if (unit !== undefined && typeof unit !== 'string') {
      msgs.push("The field 'unit' must be a string");
    }

    if (done !== undefined && typeof done !== 'boolean') {
      msgs.push("The field 'done' must be a boolean");
    }

    if (msgs.length > 0) {
      return sendError(req, res, 400, msgs);
    }

    const { weekNumber, day, itemId } = req.params;

    const item = updateItem(weekNumber, day, itemId, product, amount, unit, done);

    if (item === undefined) {
      sendError(req, res, 404, ['No item with this id']);
      return;
    }

    sendResource(req, res, item);
  }
);

server.delete(
  `${baseUrl}/api/weeks/:weekNumber/days/:day/:itemId`, 
  param('weekNumber').isInt({ min: 0, max: 51}),
  param('day').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }
    
    const { weekNumber, day, itemId } = req.params;

    const list = deleteItem(weekNumber, day, itemId);

    if (list === undefined) {
      sendError(req, res, 404, ['No item with this id']);
      return;
    }

    sendResource(req, res, list);
  }
);

server.post(
  `${baseUrl}/api/weeks/:weekNumber/days/:day/:itemId/actions`,
  param('weekNumber').isInt({ min: 0, max: 51}),
  param('day').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  body('type').isIn(['moveUp', 'moveDown']),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { weekNumber, day, itemId } = req.params;
    const { type } = req.body;
    
    let newList = undefined;
    
    if (type === 'moveUp') {
      newList = moveItem(weekNumber, day, itemId, 'up');
    } else if (type === 'moveDown') {
      newList = moveItem(weekNumber, day, itemId, 'down');
    }

    if (newList === undefined) {
      sendError(req, res, 404, ['No item with this id']);
      return;
    }

    sendResource(req, res, newList);
  }
);

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});
