const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const xss = require('xss');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');


const router = express.Router();

// laga villur

const formValidation = [
  check('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be a string of length 1 to 255 characters'),

  check('text')
    .custom(e => typeof (e) === 'string')
    .withMessage('Text must be a string'),

  check('datetime')
    .isISO8601('datetime')
    .withMessage('Datetime must be a ISO 8601 date'),

  sanitize('title').trim(),
];

router.post('/', formValidation, async (req, res) => {
  const {
    body: {
      title = '',
      text = '',
      datetime = '',
    } = {},
  } = req;

  const data = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    const listErrors = [];
    for (let i = 0; i < errors.length; i += 1) {
      listErrors.push({
        field: errors[i].param,
        error: errors[i].msg,
      });
    }
    return res.status(400).json(listErrors);
  }

  const want = await create(data);
  return res.status(201).json(want);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const want = await readOne(id);
  if (want) {
    return res.status(200).json(want);
  }
  return res.status(404).json({ error: 'Note not found' });
});

router.get('/', async (req, res) => {
  const want = await readAll();
  return res.status(200).json(want);
});

router.put('/:id', formValidation, async (req, res) => {
  const { id } = req.params;
  const {
    body: {
      title = '',
      text = '',
      datetime = '',
    } = {},
  } = req;

  const data = {
    title: xss(title),
    text: xss(text),
    datetime: xss(datetime),
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    const listErrors = [];
    for (let i = 0; i < errors.length; i += 1) {
      listErrors.push({
        field: errors[i].param,
        error: errors[i].msg,
      });
    }
    return res.status(400).json(listErrors);
  }
  const want = await update(id, data);
  if (want) {
    return res.status(201).json(want);
  }
  return res.status(404).json({ error: 'Note not found' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const want = await del(id);
  if (want) {
    return res.status(200).json();
  }
  return res.status(404).json({ error: 'Note not found' });
});


module.exports = router;
