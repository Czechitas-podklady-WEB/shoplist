const cors = require('cors');
const express = require('express');
const { nanoid } = require('nanoid');

const port = 3000;
const app = express();

app.use(cors);
app.use(express.json())

const lists = {
  'martin': [
    { id: nanoid(6), product: 'Rohlíky', amount: '10', bought: false },
    { id: nanoid(6), product: 'Máslo', amount: '1 ks', bought: false },
  ]
};

app.get('/lists', (req, res) => {
  res.send(Object.keys(lists));
});

app.put('/lists/:name', (req, res) => {
  const { name } = req.params;
  lists[name] = [];
  res.send({
    status: `Created list with name '${name}'.`,
  });
});

app.get('/lists/:name', (req, res) => {
  const { name } = req.params;
  if (name in lists) {
    res.send(lists[name]);
  } else {
    res.status(404).send({
      error: `No list with name '${name}'.`,
    })
  }
});

app.post('/lists/:name', (req, res) => {
  const { name } = req.params;
  const list = lists[name];
  
  if (list === undefined) {
    res.status(400).send({
      error: `No list with name '${name}'.`,
    });
    return;
  }
  
  const { product, amount = 'some', bought = false } = req.body;
  const newItem = { id: nanoid(6), product, amount, bought };
  list.push(newItem)
  res.send(newItem);
});

app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});