const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'wow@test.com',
  password: '123456789'
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
  afterAll(() => {
    pool.end();
  });
});
