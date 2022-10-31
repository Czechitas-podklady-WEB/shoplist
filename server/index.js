import express from 'express';
import cors from 'cors';
import { param, body, validationResult } from 'express-validator';
import { sendResource, sendError } from './nanorest.js';
import {
  getWeek,
  getDays,
  getList,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  // resetToDefault,
} from './lists.js';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();

server.use(`${baseUrl}/docs`, express.static('docs/_site', {
  extensions: ['html'],
}));

server.use(express.json());
server.use(cors());

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(req, res, 404, errors.array());
    }

    const { product, amount, done = false } = req.body;
    const msgs = [];
    if (product === undefined) {
      msgs.push("The field 'product' is required");
    }

    if (amount === undefined) {
      msgs.push("The field 'amount' is required");
    }

    if (typeof product !== 'string') {
      msgs.push("The field 'product' must be a string");
    }

    if (typeof amount !== 'string') {
      msgs.push("The field 'amount' must be a string");
    }

    if (typeof done !== 'boolean') {
      msgs.push("The field 'done' must be a boolean");
    }

    if (msgs.length > 0) {
      sendError(req, res, 400, msgs);
      return;
    }

    const { weekNumber, day } = req.params;
    const newList = addItem(weekNumber, day, product, amount, done);

    sendResource(req, res, newList);
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

    const { product, amount, done } = req.body;
    
    const msgs = [];
    if (product !== undefined && typeof product !== 'string') {
      msgs.push("The field 'product' must be a string");
    }

    if (amount !== undefined && typeof amount !== 'string') {
      msgs.push("The field 'amount' must be a string");
    }

    if (done !== undefined && typeof done !== 'boolean') {
      msgs.push("The field 'done' must be a boolean");
    }

    if (msgs.length > 0) {
      sendError(req, res, 400, msgs);
    }

    
    const { weekNumber, day, itemId } = req.params;

    const item = updateItem(weekNumber, day, itemId, product, amount, done);

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

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});
