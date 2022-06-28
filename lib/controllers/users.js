const { Router } = require('express');
const UserService = require('../services/UserService'); 
const authenticate = require('../middleware/authenticate');

const IS_DEPLOYED = process.env.NODE_ENV === 'production';
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try{
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: IS_DEPLOYED,
        sameSite: IS_DEPLOYED ? 'none' : 'strict',
        maxAge: ONE_DAY_IN_MS,
      })
      .status(204)
      .send();
  });
// .get('/me', authenticate, (req, res) => {
//   res.json(req.user);
// });
