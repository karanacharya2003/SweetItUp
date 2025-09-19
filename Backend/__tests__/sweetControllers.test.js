const request = require('supertest');
const app = require('../app');

describe('Sweet Routes', () => {
  let sweetId;

  test('POST /api/sweets → should add a sweet (admin)', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`) // mock/admin token
      .send({
        name: 'Ladoo',
        category: 'Indian',
        price: 20,
        quantity: 50
      });

    expect(res.statusCode).toBe(201);
    sweetId = res.body.id;
  });

  test('GET /api/sweets → should list sweets', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/sweets/search?name=Ladoo → should return filtered results', async () => {
    const res = await request(app).get('/api/sweets/search?name=Ladoo');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('name', 'Ladoo');
  });

  test('PUT /api/sweets/:id → should update a sweet (admin)', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send({ price: 25 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.price).toBe(25);
  });

  test('POST /api/sweets/:id/purchase → should purchase sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Purchase successful');
  });

  test('POST /api/sweets/:id/restock → should restock sweet (admin)', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Restocked');
  });

  test('DELETE /api/sweets/:id → should delete sweet (admin)', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Sweet deleted');
  });
});
