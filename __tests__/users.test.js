const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'wow@test.com',
  password: '123456789'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, userProps });
  const { email } = user;
  await agent
    .post('/api/v1/users/sessions')
    .send({ email, password });
  return [agent, user];
};

describe('users', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a user', async() => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(mockUser);
    const { email } = mockUser;
    expect(res.body).toEqual ({
      id: expect.any(String),
      email
    });
  });
  it('returns current user', async() => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.get('api/v1/users/me');
    expect(res.body).toEqual({
      ...user
    });
  });

  afterAll(() => {
    pool.end();
  });
});
