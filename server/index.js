import cors from 'cors';
import express from 'express';
import { nanoid } from 'nanoid';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();
server.use(express.json());
server.use(cors());

server.use(express.json());
server.use(cors());

const lists = {
  'default': [
    { id: nanoid(6), product: 'Rohlíky', amount: '10', bought: false },
    { id: nanoid(6), product: 'Máslo', amount: '1 ks', bought: false },
  ]
};

const success = (response, data) => {
  response.send({
    status: 'success',
    data,
  });
};

const fail = (response, data, httpStatus) => {
  response.status(httpStatus).send({
    status: 'fail',
    data
  });
};

server.get('/api/lists', (req, res) => {
  success(res, Object.keys(lists));
});

server.get('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  if (name in lists) {
    success(res, lists[name]);
  } else {
    fail(res, { 
      message: `No list with name '${name}'.`,
    }, 404);
  }
});

server.put('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  if(name.match(LIST_NAME_REGEX) === null) {
    fail(res, {
      message: 'List name contains invalid characters.',
    }, 400);
    return;
  }
  
  lists[name] = [];
  success(res, Object.keys(lists));
});

server.delete('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  if (name === 'default') {
    fail(res, {
      message: `Cannot delete the 'default' list.`,
    }, 400);
    return;
  }
  
  if (name in lists) {
    delete lists[name];
    success(res, Object.keys(lists));
    return;
  }

  fail(res, {
    message: `No list with name '${name}'`,
  }, 400);
});

server.get('/api/lists/:name/:itemId', (req, res) => {
  const { name, itemId } = req.params;
  
  const list = lists[name];
  
  if (list === undefined) {
    fail(res, { 
      message: `No list with name '${name}'.`,
    }, 400);
    return;
  }

  const item = list.find((item) => item.id === itemId);
  
  if (item === undefined) {
    fail(res, { 
      message: `No item with id '${itemId}' in list '${name}'.`,
    }, 400);
    return;
  }

  success(res, item);
});

server.post('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const list = lists[name];
  
  if (list === undefined) {
    fail(res, { 
      message: `No list with name '${name}'.`,
    }, 400);
    return;
  }
  
  const { product, amount = 'some', bought = false } = req.body;
  const newItem = { id: nanoid(6), product, amount, bought };
  list.push(newItem)
  success(res, newItem);
});

server.delete('/api/lists/:name/:itemId', (req, res) => {
  const { name, itemId } = req.params;
  
  const list = lists[name];
  
  if (list === undefined) {
    fail(res, { 
      message: `No list with name '${name}'.`,
    }, 400);
    return;
  }

  const itemIdx = list.findIndex((item) => item.id === itemId);
  
  if (itemIdx === -1) {
    fail(res, { 
      message: `No item with id '${itemId}' in list '${name}'.`,
    }, 400);
    return;
  }

  list.splice(itemIdx, 1);
  success(res);
});

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});
