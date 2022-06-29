const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeTodo = require('../middleware/authorizeTodo');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', async(req, res, next) => {
    try{
      const todo = await Todo.insert({ ...req.body, user_id: req.params.id });
      res.json(todo);
    } catch (e){
      next(e);
    }
  })
  .get('/', async(req, res, next) => {
    try{
      const data = await Todo.getAll(req.user.id);
      return res.json(data);
    } catch(e){
      next(e);
    }
  });
