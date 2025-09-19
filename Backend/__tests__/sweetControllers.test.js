const sweetCtrl = require("../controllers/sweetControllers");

describe("Sweet Controllers", () => {
  let mockReq, mockRes, mockSweet;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockSweet = {
      id: 1,
      name: "Ladoo",
      category: "Indian",
      price: 10,
      quantity: 5,
      update: jest.fn(),
      destroy: jest.fn(),
      save: jest.fn(),
    };
  });

  test("addSweet should return 400 if fields missing", async () => {
    mockReq = { body: {}, models: { Sweet: {} } };
    await sweetCtrl.addSweet(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("addSweet should create and return sweet", async () => {
    mockReq = {
      body: { name: "Ladoo", category: "Indian", price: 10, quantity: 5 },
      models: { Sweet: { create: jest.fn().mockResolvedValue(mockSweet) } },
    };
    await sweetCtrl.addSweet(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  test("listSweets should return array", async () => {
    mockReq = { models: { Sweet: { findAll: jest.fn().mockResolvedValue([mockSweet]) } } };
    await sweetCtrl.listSweets(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith([mockSweet]);
  });

  test("searchSweets should apply filters", async () => {
    mockReq = {
      query: { name: "Ladoo" },
      models: { Sweet: { findAll: jest.fn().mockResolvedValue([mockSweet]) } },
    };
    await sweetCtrl.searchSweets(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith([mockSweet]);
  });

  test("updateSweet should 404 if not found", async () => {
    mockReq = { params: { id: 1 }, body: {}, models: { Sweet: { findByPk: jest.fn().mockResolvedValue(null) } } };
    await sweetCtrl.updateSweet(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  test("deleteSweet should 404 if not found", async () => {
    mockReq = { params: { id: 1 }, models: { Sweet: { findByPk: jest.fn().mockResolvedValue(null) } } };
    await sweetCtrl.deleteSweet(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  test("purchaseSweet should reject insufficient stock", async () => {
    mockReq = { params: { id: 1 }, body: { quantity: 10 }, models: { Sweet: { findByPk: jest.fn().mockResolvedValue(mockSweet) } } };
    mockSweet.quantity = 5;
    await sweetCtrl.purchaseSweet(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("restockSweet should increase stock", async () => {
    mockSweet.quantity = 5;
    mockReq = { params: { id: 1 }, body: { quantity: 3 }, models: { Sweet: { findByPk: jest.fn().mockResolvedValue(mockSweet) } } };
    await sweetCtrl.restockSweet(mockReq, mockRes);
    expect(mockSweet.quantity).toBe(8);
  });
});
