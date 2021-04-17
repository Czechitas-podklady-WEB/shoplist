const cors = require('cors');
const express = require('express');
const { nanoid } = require('nanoid');

const port = 3000;
const app = express();

app.use(express.json())
app.use(cors())

const lists = {
  'martin': [
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

app.get('/api/lists', (req, res) => {
  success(res, Object.keys(lists));
});

app.put('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  lists[name] = [];
  success(res);
});

app.get('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  if (name in lists) {
    success(res, lists[name]);
  } else {
    fail(res, { 
      message: `No list with name '${name}'.`,
    }, 404);
  }
});

app.post('/api/lists/:name', (req, res) => {
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

app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});
