const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeTodo = require('../middleware/authorizeTodo');
const Todo = require('../models/Todo');

module.exports = Router()
  .put('/:id', authenticate, authorizeTodo, async(req, res, next) => {
    try{
      const todo = await Todo.updateById(req.params.id, req.body);
      res.json(todo);
    } catch (e){
      next(e);
    }
  });
