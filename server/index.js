import cors from 'cors';
import express from 'express';
import { success, error } from './nanorest.js';
import { 
  getAllLists,
  getList,
  createList,
  deleteList,
  getListItem,
  addListItem,
  deleteListItem,
} from './lists.js';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();
server.use(express.json());
server.use(cors());

server.use(express.json());
server.use(cors());

const LIST_NAME_REGEX = /^[a-z0-9]+$/;

server.use(`${baseUrl}/docs`, express.static('docs/_site', {
  extensions: ['html'],
}));

server.get(`${baseUrl}/api/lists`, (req, res) => {
  success(res, getAllLists());
});

server.get(`${baseUrl}/api/lists/:name`, (req, res) => {
  const { name } = req.params;
  const list = getList(name);

  if (list === null) {
    error(res, 404, { 
      code: 'not-found',
      message: `Resource not found`,
    });
  }

  success(res, list);
});


const executeCreateList = (req, res) => {
  const { name } = req.params;

  if(name.match(LIST_NAME_REGEX) === null) {
    error(res, 400, {
      code: 'invalid-list-name',
      message: 'List name contains invalid characters.',
    });
    return;
  }

  const newList = createList(name);

  if (newList === null) {
    error(res, 400, {
      code: 'list-exists',
      message: `List with name '${name}' already exists.`,
    });
    return;
  }

  success(res, newList);
}

const executeDeleteList = (req, res) => {
  const { name } = req.params;

  if (name === 'default') {
    error(res, 400, {
      code: 'no-default-delete',
      message: `Cannot delete the 'default' list.`,
    });
    return;
  }
  
  const deleteResult = deleteList(name);
  if (deleteResult) {
    success(res);
    return;
  }

  error(res, 400, {
    message: `No list with name '${name}'`,
  });
}

const executeAddItem = (req, res) => {
  const { name } = req.params;
  const list = getList(name);

  if (list === null) {
    error(res, 404, { 
      code: 'not-found',
      message: `Resource not found`,
    });
    return;
  }

  const item = addListItem(list, req.body);
  success(res, item);
}

const executeDeleteItem = (req, res) => {
  const { name, itemId } = req.params;
  const list = getList(name);

  if (list === null) {
    error(res, 404, { 
      code: 'not-found',
      message: `Resource not found`,
    });
    return;
  }

  const result = deleteListItem(list, itemId);
  if (result) {
    success(res);
    return;
  }
  
  error(res, 400, { 
    code: 'item-not-found',
    message: `No item with id '${itemId}' has been found in list '${name}'`,
  });
}

server.post(`${baseUrl}/api/lists/:name`, (req, res) => {
  const { action } = req.body;
  
  if (action === undefined) {
    error(res, 400, {
      code: 'missing-field',
      message: "The field 'action' is required",
    });
  }

  if (action === 'create') {
    return executeCreateList(req, res);
  }
  
  if (action === 'delete') {
    return executeDeleteList(req, res);
  }

  if (action === 'addItem') {
    return executeAddItem(req, res);
  }

  error(res, 400, {
    code: 'unknown-action',
    message: `There is no action '${action}'`,
  });  
});

server.get('/api/lists/:name/:itemId', (req, res) => {
  const { name, itemId } = req.params;
  
  const item = getListItem(name, itemId);
  
  if (item === null) {
    error(res, 404, { 
      code: 'not-found',
      message: `Resource not found`,
    })
    return;
  }

  success(res, item);
});

server.post('/api/lists/:name/:itemId', (req, res) => {
  const { action } = req.body;
  
  if (action === undefined) {
    error(res, 400, {
      code: 'missing-field',
      message: "The field 'action' is required",
    });
  }

  if (action === 'deleteItem') {
    return executeDeleteItem(req, res);
  }

  error(res, 400, {
    code: 'unknown-action',
    message: `There is no action '${action}'`,
  });  
});

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});
