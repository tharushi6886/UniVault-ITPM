const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Order = require('../models/Order');

// Mock the Order model
jest.mock('../models/Order');

// Mock the protect middleware
jest.mock('../middlewares/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { _id: 'mockUserId' };
    next();
  }
}));

describe('Order API Endpoints', () => {
  afterAll(async () => {
    // Close the DB connection to avoid leaks (app calls dbConnection())
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    it('should create a new order successfully', async () => {
      const mockOrder = {
        _id: 'mockOrderId',
        itemId: 'mockItemId',
        totalPrice: 1000
      };

      // Mock the save method for the instance
      Order.prototype.save = jest.fn().mockResolvedValue(mockOrder);

      const res = await request(app)
        .post('/api/orders')
        .field('itemId', 'item123')
        .field('sellerId', 'seller456')
        .field('deliveryMethod', 'courier')
        .field('building', 'Main Hall')
        .field('room', 'A1')
        .field('preferredDate', '2026-05-01')
        .field('timeWindow', 'morning')
        .field('totalPrice', 1000)
        .field('deliveryFee', 100)
        .field('courierBid', 50)
        .attach('receipt', 'tests/dummy_receipt.png');

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual("Order created successfully");
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          itemId: 'item123'
          // missing other required fields
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});
