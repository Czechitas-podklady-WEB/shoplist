import express from 'express';
import cors from 'cors';
import { param, body, validationResult } from 'express-validator';
import { sendResource, sendError } from './nanorest.js';
import {
  getWeeks,
  getWeek,
  getDays,
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

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});
