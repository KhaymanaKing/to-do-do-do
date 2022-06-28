const { Router } = require('express');
const UserService = require('../services/UserService'); 
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try{
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })
  .get('/me', authenticate, (req, res) => {
    res.json(req.user);
  });
