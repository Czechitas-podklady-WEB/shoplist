import express from 'express';
import cors from 'cors';
import { weekController } from './controllers/week-controller.js';
import { authController } from './controllers/auth-controller.js';
import { registerUser } from './controllers/users-db.js';
import { body, param, validationResult } from 'express-validator';
import { createDefaultWeek } from './lists/weeks.js';
import { resource } from './nanorest.js';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();

server.use(`${baseUrl}/docs`, express.static('docs/_site', {
  extensions: ['html'],
}));

server.use(express.json());
server.use(cors());

server.use(`${baseUrl}/api/sampleweek`, weekController({ useSampleWeek: true }));

server.use(
  `${baseUrl}/api/myweek`,
  authController,
  weekController({ useSampleWeek: false }),
);

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
        errors,
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
      type: 'userInfo',
      results: {
        email: result.value.email,
      }
    });
  },
);

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});
