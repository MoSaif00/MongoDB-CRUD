const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const Joi = require('joi');
const app = express();
app.use(bodyParser.json());

const collection = 'todo';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getTodos', (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) console.log('there is no such data, Opps');
      else console.log(documents);
      res.json(documents);
    });
});

app.put('/:id', (req, res) => {
  const todoId = req.params.id;
  const userInput = req.body;

  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      {_id: db.getPrimaryKey(todoId)},
      {$set: {todo: userInput.todo}},
      {returnOriginal: false},
      (err, result) => {
        if (err) console.log('opps, something went wrong');
        else res.json(result);
      }
    );
});

app.post('/', (req, res) => {
  const userInput = req.body;
  db.getDB()
    .collection(collection)
    .insertOne(userInput, (err, result) => {
      if (err)
        console.log('there is an error with posting with recent todo task');
      else res.json({result: result, document: result.ops[0]});
    });
});

app.delete('/:id', (req, res) => {
  const todoId = req.params.id;
  db.getDB()
    .collection(collection)
    .findOneAndDelete({_id: db.getPrimaryKey(todoId)}, (err, result) => {
      if (err) console.log("We couldn't delete the item with id ", todoId);
      else res.json(result);
    });
});

db.connect((err) => {
  if (err) {
    console.log('unable to connect to database');
    process.exit(1);
  } else {
    app.listen(8000, () => {
      console.log('database is connected at port 8000');
    });
  }
});
