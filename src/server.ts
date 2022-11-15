import express from 'express';
import cors from 'cors';
import { weekController } from './controllers/week-controller.js';
import { authController } from './controllers/auth-controller.js';
import { findUser, findUserByToken, registerUser } from './controllers/users-db.js';
import { body, param, validationResult } from 'express-validator';
import { createDefaultWeek } from './lists/weeks.js';
import { resource } from './nanorest.js';
import { nanoid } from 'nanoid';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();

server.use(`${baseUrl}/docs`, express.static('docs/_site', {
  extensions: ['html'],
}));

server.use(express.json());
server.use(cors());

server.use(`${baseUrl}/api/sampleweek`, weekController({ useSampleWeek: true }));

const weeks = new Array(52).fill(createDefaultWeek());

server.get(
  `${baseUrl}/api/weeks`,
  resource('weeks', (req, res) => {
    res.success(weeks.map(
      (week, index) => ({
        type: 'week',
        url: `${req.originalUrl}/${index}`,
      })
    ));
  })
);

server.use(
  `${baseUrl}/api/weeks/:weekNumber`,
  param('weekNumber').isInt({ min: 0, max: 51}).bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 'error', errors: errors.array() });
    }

    const weekNumber = Number(req.params.weekNumber);
    req.week = weeks[weekNumber];
    next();
  },
  weekController({ useSampleWeek: false }),
);

server.post(
  `${baseUrl}/api/register`,
  body('email').isEmail(),
  body('password').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({
        status: 'error',
        errors: errors.array(),
      })
      return;
    }
    
    const { email, password } = req.body;

    const result = registerUser(email, password);
    if (result.status === 'fail') {
      res.status(400).send({
        status: 'error',
        errors: result.errors,
      })
      return;
    }

    res.send({
      status: 'success',
      type: 'user',
      results: {
        email: result.value.email,
      }
    });
  },
);

server.post(
  `${baseUrl}/api/login`,
  body('email').isEmail(),
  body('password').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({
        status: 'error',
        errors: errors.array(),
      })
      return;
    }
    
    const { email, password } = req.body;

    const user = findUser(email);

    if (user === undefined || user.password !== password) {
      res.status(403).send({
        status: 'error',
        errors: ['Invalid email or password'],
      });
      return;
    }

    user.token = nanoid();

    res.send({
      status: 'success',
      type: 'login',
      results: {
        email: user.email,
        token: user.token,
      }
    });
  },
);

server.use(`${baseUrl}/api/me`, authController);

server.get(
  `${baseUrl}/api/me`,
  resource('user', (req, res) => {
    res.success({ email: req.user?.email });
  }),
);

server.get(
  `${baseUrl}/api/me/logout`,
  (req, res) => {
    req.user!.token = undefined;
    res.send({ status: 'success' });
  },
);

server.use(
  `${baseUrl}/api/me/week`,
  weekController({ useSampleWeek: false }),
);

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});
