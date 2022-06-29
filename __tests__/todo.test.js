const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Todo = require('../lib/models/Todo');

const mockUser = {
  email: 'wow@test.com',
  password: '123456789'
};

const mockUser2 = {
  email: 'wow2@test.com',
  password: '123456789'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent
    .post('/api/v1/users/sessions')
    .send({ email, password });
  return [agent, user];
};

describe('todos', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new to do for current user', async() => {
    const [agent] = await registerAndLogin();
    const newTodo = { todo: 'Yell', };
    const res = await agent
      .post('/api/v1/todos')
      .send(newTodo);
    expect(res.status).toEqual(200);
  });
  it(' gets all items associated with the authenticated user', async () => {
    const [agent, user] = await registerAndLogin();
    const user2 = await UserService.create(mockUser2);
    const user1Todo = await Todo.insert({ 
      todo: 'bigger yell', 
      user_id: user.id });
    await Todo.insert({
      todo: 'sleep',
      user_id: user2.id
    });
    const res = await agent.get('/api/v1/todos');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([user1Todo]);
  });
  it('returens a 401 for non authenticated users', async() => {
    const res = await request(app).get('/api/v1/todos');
    expect(res.status).toBe(401);
  });

});


